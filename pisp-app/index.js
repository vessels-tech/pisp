import PISPApi from './PISPApi.js'
import FidoApi from './FidoApi.js'
import {
  getFormValues
} from './util.js'


/* State */
const initialState = {
  currentStep: 0,
  dfspLoginStep: 0,
  selectedBank: '',
  selectedAccount: '',
  pispUsername: '',
  pispPassword: '',
  dfspUsername: '',
  sendAmount: 100,
  payeeName: 'Carrie',
  payeeMSISDN: "+61 123 456 789",
  fee: 2,
  loaders: {
    linkAccountButton: false,
    sendQuoteButton: false,
    transferButtons: false
  },
  credentialId: '',
}

var state = {
  ...initialState
}


/* Page Helpers */
const pageSections = {
  pispLogin: 0,
  dfspLogin: 1,
  linkDevice: 2,
  sendQuoteSection: 3,
  approveTransfer: 4,
}

const forms = {
  pispLoginForm: {
    id: '#pispLoginForm',
    onSubmitFunc: onPispFormSubmit,
  },
  dfspLoginForm: {
    id: '#dfspLoginForm',
    onSubmitFunc: onDFSPFormSubmit,
  },
  getQuoteForm: {
    id: '#getQuoteForm',
    onSubmitFunc: sendQuote,
  },
}

const bankSections = {
  bankSelector: '#bankSelector', // 0
  bankLogin: '#bankLogin', // 1
  bankSelectAccount: '#bankSelectAccount', // 2
}

const dynamicText = {
  loginPromptText: '#loginPromptText',
  selectedBankText: '#selectedBankText',
  linkAccountText: '#linkAccountText',
  transferLine1: '#transferLine1',
  transferLine2: '#transferLine2',
}

//Map the button to it's repsective loading indicator
const loaders = {
  pispLoginButton: '#pispLoginButtonLoader',
  linkAccountButton: '#linkAccountButtonLoader',
  sendQuoteButton: '#sendQuoteButtonLoader',
  transferButtons: '#transferButtonLoader',
}

/* Event Listeners */
function onResetDemo() {
  setState({
    ...initialState
  })
}

function onPispFormSubmit(formValues) {
  const loginToPISP = wrapLoaderFunction(PISPApi.mock_loginToPISP, 'pispLoginButton')

  loginToPISP(formValues)
  .then((result) => {
    console.log("result", result)
    setState({
      ...formValues,
      currentStep: 1,
    })
  })
  .catch(err => console.log("Err in loginToPisp", err))
}

function selectBank(bankId) {
  setState({
    selectedBank: bankId,
    dfspLoginStep: 1
  })
}

function onDFSPFormSubmit(formValues) {
  //TODO: Api call

  setState({
    dfspLoginStep: 2
  })
}

function selectAccount(selectedAccount) {
  setState({
    selectedAccount,
    dfspLoginStep: -1,
    currentStep: 2
  })
}

async function linkAccount() {
  const createCredential = wrapLoaderFunction(FidoApi.createCredential, 'linkAccountButton')
  const options = {
    name: state.dfspUsername,
    // Maybe this should be the display name of user, not account...
    displayName: state.selectedAccount,
  }

  createCredential(options)
  .then(createCredentialResult => {
    setState({
      currentStep: 3,
      credentialId: createCredentialResult.id,
    })
  })
}

function sendQuote(formValues) { 
  const getQuote = wrapLoaderFunction(PISPApi.getQuote, 'sendQuoteButton')
  console.log("formValues", formValues)

  getQuote(formValues)
  .then(quoteResponse => {
    setState({
      currentStep: 4,
      payeeMSISDN: formValues.msisdn,
      sendAmount: formValues.amount,
      payeeName: quoteResponse.partyName,
      fee: quoteResponse.fee,
    })
  })
}

function approveTransfer() {
  waitForLoader('transferButtons', true)

  PISPApi.sendTransfer(state.credentialId)
  .then(() => {
    console.log("transfer sent.")
    waitForLoader('transferButtons', false)
  })
  .catch(err => {
    waitForLoader('transferButtons', false)
  })
}

function rejectTransfer() {
  console.log("TODO: reject transfer")
}


/* Global State */

/**
 * @description Wrap an async call with "waitForLoader" calls
 */
function wrapLoaderFunction(myAsyncFunction, buttonId) {
  waitForLoader(buttonId, true)

  return (...args) => {
    return myAsyncFunction(...args)
      .then((result) => {
        waitForLoader(buttonId, false)
        return result
      })
      .catch(err => {
        waitForLoader(buttonId, false)
        // re-throw error to escape
        throw err
      })
  }
}

function waitForLoader(id, loading = true) {
  const { loaders } = state;
  loaders[id] = loading;

  setState({loaders})
}

function setState(newState) {
  const prevState = JSON.parse(JSON.stringify(state))
  state = {
    ...prevState,
    ...newState
  }
  onStateUpdated(prevState)
}

function onStateUpdated(prevState) {
  if (prevState.currentStep !== state.currentStep) {
    highlightSection(state.currentStep)
  }

  if (prevState.dfspLoginStep !== state.dfspLoginStep) {
    showDfspLoginStep(state.dfspLoginStep)
  }

  // Update text
  $(dynamicText.loginPromptText).html(state.pispUsername ? `Hi <b>${state.pispUsername}</b>, please login with your DFSP.` : `Please login to proceed`)
  $(dynamicText.selectedBankText).html(`Login with your details to <b>${state.selectedBank}</b>.`)
  $(dynamicText.linkAccountText).html(`Linking xxxx${state.selectedAccount} with this device.`)
  $(dynamicText.transferLine1).html(`You are sending: <b>$${state.sendAmount}</b> to <b>${state.payeeName}</b> at <b>${state.payeeMSISDN}</b>`)
  $(dynamicText.transferLine2).html(`This will cost <b>$${state.fee}</b>, and <b>$${state.sendAmount - state.fee}</b> will reach <b>${state.payeeName}</b>`)

  // Update Loaders
  Object.keys(state.loaders).forEach(k => {
    const visible = state.loaders[k]
    const id = loaders[k]
    if (visible) {
      $(id).show()
      $(`#${k}`).hide()
    } else {
      $(id).hide()
      $(`#${k}`).show()
    }
  })
}

/* Display Functions */
function highlightSection(sectionIndex, shouldScroll = true) {
  if (shouldScroll) {
    scrollToAnchor(sectionIndex);
  }
  Object.keys(pageSections).forEach(sectionName => $(`#${sectionName}`).css({ opacity: 0.5 }))

  const highlightId = Object.keys(pageSections)[sectionIndex]
  $(`#${highlightId}`).css({ opacity: 1 })
}

function showDfspLoginStep(activeStep) {
  Object.values(bankSections).forEach(v => $(v).hide())
  const stepCount = Object.values(bankSections).length

  //only show the active step if it's in range
  if (activeStep > Object.values(bankSections).length || activeStep < 0 ) {
    return;  
  }
  
  const activeStepId = Object.values(bankSections)[activeStep]
  $(activeStepId).show()
}

function hideLoaders() {
  Object.values(loaders).forEach(v => $(v).hide())
}

/* Util Functions */
function scrollToAnchor(aid) {
  var aTag = $("a[name='" + aid + "']");
  $('html,body').animate({ scrollTop: aTag.offset().top }, 'slow');
}


function init() {
  setState({})
  highlightSection(0, false)
  showDfspLoginStep(0)

  hideLoaders()

  // Add form selectors, with helper function wrappers
  Object.values(forms).forEach(({ id, onSubmitFunc }) => {
    $(id).submit((event) => {
      event.preventDefault();
        const formValues = getFormValues(id)
      return onSubmitFunc(formValues)
    })
  })

  // Button listeners
  $('#selectBankA').on('click', () => selectBank('BankA'));
  $('#selectBankB').on('click', () => selectBank('BankB'));
  $('#selectAccount9876').on('click', () => selectAccount('9876'));
  $('#selectAccount1234').on('click', () => selectAccount('1234'));
  $('#linkAccountButton').on('click', () => linkAccount());
  // $('#sendQuoteButton').on('click', () => sendQuote());
  $('#approveTransferButton').on('click', () => approveTransfer());
  $('#rejectTransferButton').on('click', () => rejectTransfer());
  $('#resetDemo').on('click', () => onResetDemo());
  $('#resetDemoBottom').on('click', () => onResetDemo());
}


/* Main */
$(document).ready(function () {
  init()

  // Set state for easily debugging
  const testState = {
    currentStep: 2,
    dfspLoginStep: 4,
    selectedBank: 'BankA',
    selectedAccount: '9876',
    pispUsername: 'sstevens@asthmatickitty.com',
    pispPassword: '12345',
    dfspUsername: '111122223333',
    sendAmount: 100,
    payeeName: 'Carrie',
    payeeMSISDN: "+61 123 456 789",
    quoteFee: 2,
  }

  setState({...testState})
});
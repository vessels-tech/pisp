import PISPApi from './PISPApi.js'
import FidoApi from './FidoApi.js'
import Templates from './Templates.js'
import {
  getFormValues
} from './util.js'


/* State */
const initialState = {
  currentStep: 0,
  dfspLoginStep: 0,
  sendQuoteStep: 0,
  selectedBank: '',
  accountList: [],
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
  lookupPartyForm: {
    id: '#lookupPartyForm',
    onSubmitFunc: lookupParty,
  },
  getQuoteForm: {
    id: '#getQuoteForm',
    onSubmitFunc: createQuote,
  },
}

const bankSections = {
  bankSelector: '#bankSelector', // 0
  bankLogin: '#bankLogin', // 1
  bankSelectAccount: '#bankSelectAccount', // 2
}

const lookupAndQuoteSections = {
  lookupParty: '#lookupParty', //0
  getQuote: '#getQuote', //1
  sentQuote: '#sentQuote', //2
}

const dynamicText = {
  loginPromptText: '#loginPromptText',
  selectedBankText: '#selectedBankText',
  linkAccountText: '#linkAccountText',
  quoteSendToText: '#quoteSendToText',
  transferLine1: '#transferLine1',
  transferLine2: '#transferLine2',
}

//Map the button to it's repsective loading indicator
const loaders = {
  pispLoginButton: '#pispLoginButtonLoader',
  linkAccountButton: '#linkAccountButtonLoader',
  lookupQuoteButton: '#lookupQuoteButtonLoader',
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
    setState({
      ...formValues,
      currentStep: 1,
    })
  })
  .catch(err => console.log("Err in loginToPisp", err))
}

function selectBank(bankId) {

  PISPApi.getDFSPLoginPage(bankId)
  // TODO: display iframe with login page
  .then(() => {
    setState({
      selectedBank: bankId,
      dfspLoginStep: 1
    })
  })
}

function onDFSPFormSubmit(formValues) {
  //TODO: loaders?
  PISPApi.mock_loginToDFSP(formValues)
  // TODO: wrap this in a polling function? Or should it be syncronous like above?
  .then((token) => PISPApi.getDFSPAccountMetadata(token))
  .then((accountList) => {
    setState({
      dfspLoginStep: 2,
      accountList,
    })
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
  const registerPublicKey = wrapLoaderFunction(PISPApi.registerPublicKey, 'linkAccountButton')
  const options = {
    name: state.dfspUsername,
    // Maybe this should be the display name of user, not account...
    displayName: state.selectedAccount,
  }

  let _createCredentialResult
  createCredential(options)
  .then((result) => _createCredentialResult = result)
  .then(() => registerPublicKey(_createCredentialResult))
  .then(() => {
    setState({
      currentStep: 3,
      credentialId: _createCredentialResult.id,
    })
  })
}

function lookupParty(formValues) {
  const lookupParties = wrapLoaderFunction(PISPApi.lookupParties, 'lookupPartyButton')

  lookupParties(formValues)
  .then(result => {
    // TODO: set the user name here for the quote form
    setState({
      sendQuoteStep: 1,
      payeeMSISDN: formValues.msisdn,
      // TODO: set the payeeName here from the result
      // payeeName: result.payeeName,
    })
  })

}

function createQuote(formValues) { 
  const createQuote = wrapLoaderFunction(PISPApi.createQuote, 'sendQuoteButton')
  // TODO: wrap getQuoteAndPendingAuth in a poll function
  const getQuoteAndPendingAuth = wrapLoaderFunction(PISPApi.getQuoteAndPendingAuth, 'sendQuoteButton')

  createQuote(formValues)
  .then(() => getQuoteAndPendingAuth())
  .then(quoteResponse => {
    setState({
      currentStep: 4,
      sendQuoteStep: 2,
      sendAmount: formValues.amount,
      fee: quoteResponse.fee,
    })
  })
}

function approveTransfer() {
  const sendTransfer = wrapLoaderFunction(PISPApi.approveTransfer, 'transferButtons')
  // TODO: poll this
  const getTransferStatus = wrapLoaderFunction(PISPApi.getTransferStatus, 'transferButtons')

  sendTransfer(state.credentialId)
  // Wait until the transfer status has been updated
  getTransferStatus()
  .then(() => {
    window.alert("Your money is on its way!")
  })
  .catch(err => {
    window.alert("Failed to send transfer! Error details: " + err)
  })
}

function rejectTransfer() {
  console.log("TODO: reject transfer")
}

/* Global State */

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

  if (prevState.sendQuoteStep !== state.sendQuoteStep) {
    showQuoteStep(state.sendQuoteStep)
  }

  // Update text
  $(dynamicText.loginPromptText).html(state.pispUsername ? `Hi <b>${state.pispUsername}</b>, please login with your DFSP.` : `Please login to proceed`)
  $(dynamicText.selectedBankText).html(`Login with your details to <b>${state.selectedBank}</b>.`)
  $(dynamicText.linkAccountText).html(`Linking xxxx${state.selectedAccount} with this device.`)
  $(dynamicText.quoteSendToText).html(`<b>${state.payeeName}</b>`)
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

  // Re-render the account list if needed
  const prevAccListHash = prevState.accountList.reduce((acc, curr) => acc + curr.id, '');
  const currAccListHash = state.accountList.reduce((acc, curr) => acc + curr.id, '');
  if (prevAccListHash !== currAccListHash) {
    $('#bankSelectAccountList').html('')
  
    const tiles = state.accountList.reduce((acc, curr, idx) => acc + Templates.accountTile(curr, idx), "")    
    $('#bankSelectAccountList').html(tiles)
    
    state.accountList.forEach(account => $(`#selectAccount${account.id}`).on('click', () => selectAccount(account.id)))
  }
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

function showQuoteStep(activeStep) {
  Object.values(lookupAndQuoteSections).forEach(v => $(v).hide())
  const stepCount = Object.values(lookupAndQuoteSections).length

  //only show the active step if it's in range
  if (activeStep > Object.values(lookupAndQuoteSections).length || activeStep < 0 ) {
    return;  
  }
  
  const activeStepId = Object.values(lookupAndQuoteSections)[activeStep]
  $(activeStepId).show()
}

function hideLoaders() {
  Object.values(loaders).forEach(v => $(v).hide())
}

function waitForLoader(id, loading = true) {
  const { loaders } = state;
  loaders[id] = loading;

  setState({ loaders })
}

/* Util Functions */
function scrollToAnchor(aid) {
  var aTag = $("a[name='" + aid + "']");
  $('html,body').animate({ scrollTop: aTag.offset().top }, 'slow');
}

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

/* Main */
function init() {
  setState({})
  highlightSection(0, false)
  showDfspLoginStep(0)
  showQuoteStep(0)

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
  $('#approveTransferButton').on('click', () => approveTransfer());
  $('#rejectTransferButton').on('click', () => rejectTransfer());
  $('#resetDemo').on('click', () => onResetDemo());
  $('#resetDemoBottom').on('click', () => onResetDemo());
}

$(document).ready(function () {
  init()

  // Set state for easily debugging
  const testState = {
    currentStep: 2,
    dfspLoginStep: 4,
    sendQuoteStep: 0,
    selectedBank: 'BankA',
    selectedAccount: '9876',
    pispUsername: 'sstevens@asthmatickitty.com',
    pispPassword: '12345',
    dfspUsername: '111122223333',
    sendAmount: 100,
    payeeName: 'Carrie',
    payeeMSISDN: "+61 123 456 789",
    quoteFee: 2,
    accountList: [],
  }

  // setState({...testState})
});
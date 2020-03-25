
import { createCredential } from './lib.js'



/* State */
const initialState = {
  currentStep: 0,
  dfspLoginStep: 0,
  selectedBank: '',
  selectedAccount: '',
  pispUsername: '',
  pispPassword: '',

  sendAmount: 100,
  payeeName: 'Carrie',
  payeeMSISDN: "+61 123 456 789",
  quoteFee: 2, 
}

var state = {
  ...initialState
}


/* Page Helpers */

const pageSections = {
  pispLogin: 0,
  dfspLogin: 1,
  linkDevice: 2,
  sendQuote: 3,
  approveTransfer: 4,
}

const bankSections = {
  bankSelector: '#bankSelector', //0
  bankLogin: '#bankLogin', //1
  bankSelectAccount: '#bankSelectAccount', //2
}

const dynamicText = {
  loginPromptText: '#loginPromptText',
  selectedBankText: '#selectedBankText',
  linkAccountText: '#linkAccountText',
  transferLine1: '#transferLine1',
  transferLine2: '#transferLine2',
}



/* Event Listeners */

function onResetDemo() {
  setState({
    ...initialState
  })
}

function onPispFormSubmit(event) {
  const inputs = $('#pispLoginForm :input');
  const values = {};
  inputs.each(function (input) {
    if (!this.name) {
      return;
    }
    values[this.name] = $(this).val();
  });

  console.log(values)

  setState({
    ...values,
    currentStep: 1,
  })

  event.preventDefault();
}

function selectBank(bankId) {
  setState({
    selectedBank: bankId,
    dfspLoginStep: 1
  })
}

function onDFSPFormSubmit(event) {
  event.preventDefault();

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

function linkAccount() {
  //TODO: fido magic here
  createCredential()

  setState({
    currentStep: 3
  })
}

function sendQuote() {
  setState({
    currentStep: 4
  })
}

function approveTransfer() {
  console.log("TODO: approve transfer")
}

function rejectTransfer() {
  console.log("TODO: reject transfer")
}


/* Global State */

function setState(newState) {
  console.log("updating state")
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


  //Update text
  $(dynamicText.loginPromptText).html(state.pispUsername ? `Hi <b>${state.pispUsername}</b>, please login with your DFSP.` : `Please login to proceed`)
  $(dynamicText.selectedBankText).html(`Login with your details to <b>${state.selectedBank}</b>.`)

  $(dynamicText.linkAccountText).html(`Linking xxxx${state.selectedAccount} with this device.`)
  $(dynamicText.transferLine1).html(`You are sending: <b>$${state.sendAmount}</b> to <b>${state.payeeName}</b> at <b>${state.payeeMSISDN}</b>`)
  $(dynamicText.transferLine2).html(`This will cost <b>$${state.quoteFee}</b>, and <b>$${state.sendAmount - state.quoteFee}</b> will reach <b>${state.payeeName}</b>`)
}

/* Display Functions */

function highlightSection(sectionIndex, shouldScroll = true) {
  if (shouldScroll) {
    scrollToAnchor(sectionIndex);
  }
  Object.keys(pageSections).forEach(sectionName => $(`#${sectionName}`).css({ opacity: 0.5 }))

  const highlightId = Object.keys(pageSections)[sectionIndex]
  console.log("highlightId", highlightId)
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

/* Util Functions */
function scrollToAnchor(aid) {
  var aTag = $("a[name='" + aid + "']");
  $('html,body').animate({ scrollTop: aTag.offset().top }, 'slow');
}


function init() {
  setState({})

  highlightSection(0, false)
  showDfspLoginStep(0)

  // Add form selectors
  $('#pispLoginForm').submit(onPispFormSubmit)
  $('#dfspLoginForm').submit(onDFSPFormSubmit)

  // Button listeners
  $('#selectBankA').on('click', () => selectBank('BankA'));
  $('#selectBankB').on('click', () => selectBank('BankB'));
  $('#selectAccount9876').on('click', () => selectAccount('9876'));
  $('#selectAccount1234').on('click', () => selectAccount('1234'));
  $('#linkAccountButton').on('click', () => linkAccount());
  $('#sendQuoteButton').on('click', () => sendQuote());
  $('#approveTransferButton').on('click', () => approveTransfer());
  $('#rejectTransferButton').on('click', () => rejectTransfer());
  $('#resetDemo').on('click', () => onResetDemo());
  $('#resetDemoBottom').on('click', () => onResetDemo());
}


/* Main */
$(document).ready(function () {
  init()
});
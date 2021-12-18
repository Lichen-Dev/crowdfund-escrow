import React, { Component } from 'react'
import Web3 from 'web3'
import './App.css'; 
import {DAI_ADDRESS, ERC20_ABI, ESCROWCONTRACT_ABI, ESCROWCONTRACT_ADDRESS} from './config'
class App extends Component{
  componentWillMount(){
    this.loadBlockchainData()
  }

  


  async loadBlockchainData(){
    const web3 = new Web3(Web3.givenProvider || "http://localhost:3000")
    const network = await web3.eth.net.getNetworkType()
    console.log("network", network)
    const accounts = await web3.eth.getAccounts()
    this.setState({account: accounts[0]})
    var balance = await web3.eth.getBalance(accounts[0])
    balance = web3.utils.fromWei(balance, 'ether')
    this.setState({balance: balance})
    const daicontract = new web3.eth.Contract(ERC20_ABI, DAI_ADDRESS)
    
    var daibalance= await daicontract.methods.balanceOf(accounts[0]).call()
    var contractbalance = await daicontract.methods.balanceOf(ESCROWCONTRACT_ADDRESS).call()
    this.setState({daibalance: daibalance})

    this.setState({ProposalBalance: contractbalance})
    
    //daicontract.methods.approve('0xFaCA1b61C03e4355Ce6BB0CeB7efB9E1709E9369', 9999999 ).send({from: accounts[0]})
  }



  constructor(props){
    super(props)
    this.state = {account: ''}
    this.state = {balance: ''}
    this.state ={daibalance: ''}
    this.state = {ProposalAddress: ''}
    this.state = {ProposalAmount: ''}
    this.state = {ProposalRequest: ''}
    this.state = {FunderAmount: ''}
    this.state = {FunderIdentifier: ''}
    this.state = {ProposalBalance: ''}
    this.state = {FunderVote: ''}
    this.state = {ProposalDescription: ''}
    this.state = {RoundDescription: ''}
    this.state = {HashTest: ''}
    this.state = {HashStatus: ''}
    this.state = {RealProposalAmount: ''}
    this.state = {ProposalAmountFunded: ''}
    this.state = {ProposalRound: ''}
    this.state = {ProposalVote: ''}
    this.state = {ProposalFundsSpent: ''}
    this.state = {RealProposalDescription: ''}
    this.state = {RealRoundDescription: ''}
    this.state= {jeff: ''}
  }

  async SubmitProposal(){
    const web3 = new Web3(Web3.givenProvider || "http://localhost:3000")
    const accounts = await web3.eth.getAccounts()
    const escrowcontract = new web3.eth.Contract(ESCROWCONTRACT_ABI, ESCROWCONTRACT_ADDRESS)
    var balance = await web3.eth.getBalance(accounts[0])
    
    escrowcontract.methods.MakeProposal(this.state.ProposalAmount, this.state.ProposalAddress, this.state.ProposalDescription).send({from: accounts[0]})
  }

  async SubmitRequest(){
    const web3 = new Web3(Web3.givenProvider || "http://localhost:3000")
    const accounts = await web3.eth.getAccounts()
    const escrowcontract = new web3.eth.Contract(ESCROWCONTRACT_ABI, ESCROWCONTRACT_ADDRESS)
    var balance = await web3.eth.getBalance(accounts[0])
    
    escrowcontract.methods.RequestAmounts(this.state.ProposalRequest, this.state.account, this.state.RoundDescription).send({from: accounts[0]})
  }

  async FundProposal(){
    const web3 = new Web3(Web3.givenProvider || "http://localhost:3000")
    const accounts = await web3.eth.getAccounts()
    const escrowcontract = new web3.eth.Contract(ESCROWCONTRACT_ABI, ESCROWCONTRACT_ADDRESS)
    const daicontract = new web3.eth.Contract(ERC20_ABI, DAI_ADDRESS)
    var FunderAmount = this.state.FunderAmount.concat('000000000000000000')
    daicontract.methods.approve(ESCROWCONTRACT_ADDRESS, FunderAmount ).send({from: accounts[0]})
    escrowcontract.methods.FundProposal(this.state.FunderAmount, this.state.ProposalAddress, this.state.FunderIdentifier).send({from: accounts[0]})

  }

  async Vote(){
    const web3 = new Web3(Web3.givenProvider || "http://localhost:3000")
    const accounts = await web3.eth.getAccounts()
    const escrowcontract = new web3.eth.Contract(ESCROWCONTRACT_ABI, ESCROWCONTRACT_ADDRESS)
    escrowcontract.methods.vote(this.state.FunderVote, this.state.ProposalAddress, this.state.FunderIdentifier).send({from: accounts[0]})

  }

  async ReleaseFunds(){
    const web3 = new Web3(Web3.givenProvider || "http://localhost:3000")
    const accounts = await web3.eth.getAccounts()
    const escrowcontract = new web3.eth.Contract(ESCROWCONTRACT_ABI, ESCROWCONTRACT_ADDRESS)
    escrowcontract.methods.releasefunds(this.state.ProposalAddress).send({from: accounts[0]})
  }
  async ReturnFunds(){
    const web3 = new Web3(Web3.givenProvider || "http://localhost:3000")
    const accounts = await web3.eth.getAccounts()
    const escrowcontract = new web3.eth.Contract(ESCROWCONTRACT_ABI, ESCROWCONTRACT_ADDRESS)
    escrowcontract.methods.ReturnFunds(this.state.FunderIdentifier, this.state.ProposalAddress).send({from: accounts[0]})
  }
  async GetProposalDetails(){
    const web3 = new Web3(Web3.givenProvider || "http://localhost:3000")
    const accounts = await web3.eth.getAccounts()
    const escrowcontract = new web3.eth.Contract(ESCROWCONTRACT_ABI, ESCROWCONTRACT_ADDRESS)
    
    const ProposalDetails = await escrowcontract.methods.GetProposalDetails(this.state.ProposalAddress).call()
    
    var RoundDescription = await escrowcontract.methods.GetRoundDescription(this.state.ProposalAddress).call()
    var ProposalDescription = await escrowcontract.methods.GetDescription(this.state.ProposalAddress).call()

    this.setState({RealRoundDescription: RoundDescription})
    this.setState({RealProposalDescription: ProposalDescription})
    this.setState({RealProposalAmount: ProposalDetails[0]})
    this.setState({ProposalAmountFunded: ProposalDetails[1]})
    this.setState({ProposalRound: ProposalDetails[2]})
    this.setState({ProposalVote: ProposalDetails[3]})
    this.setState({ProposalFundsSpent: ProposalDetails[4]})

  }


  render(){
    return(
    <div className="container">
      <h1>My Details </h1>
      <p>my acc: {this.state.account}</p>
      <p>my bal: {this.state.balance}</p>
      <p> my dai bal: {this.state.daibalance}</p>
      <h1>Proposal Details</h1>
      <p> Proposal Description {this.state.RealProposalDescription}</p> 
      <p> Round Description {this.state.RealRoundDescription}</p>
      <p> Proposal Address: {this.state.ProposalAddress}</p>
      <p> Proposal Amount Request: {this.state.RealProposalAmount}</p>
      <p> Proposal Amount Funded: {this.state.ProposalAmountFunded}</p>
      <p> Proposal Round Amount: {this.state.ProposalRound}</p>
      <p> Proposal Vote: {this.state.ProposalVote}</p>
      <p> Proposal Funds Spent: {this.state.ProposalFundsSpent}</p>
      <br></br>
      
      <h3>Get Proposal Details</h3>
      <br></br>
      <form onSubmit={(event) => {
        event.preventDefault()
        this.setState({ProposalAddress: event.target[0].value})
        this.GetProposalDetails()

      }}>
         <input
            id="newProposalAddress"
            type="text"
            className="form-control"
            placeholder="Proposal Address"
            required />
<input type="submit"  />
</form>
<br></br>
      <h3>Make Proposal</h3>
      <br></br>
      
      

        <form onSubmit={(event) => {
          event.preventDefault()
         this.setState({ProposalAddress: event.target[0].value})
         this.setState({ProposalAmount: event.target[1].value})
         this.setState({ProposalDescription: event.target[2].value})
         this.SubmitProposal()
        }}>
          <input
            id="newProposalAddress"
            type="text"
            className="form-control"
            placeholder="Proposal Address"
            required />
           
           <input
            id="newProposalAmount"
            type="text"
            className="form-control"
            placeholder="Proposal Amount"
            required />

            <input
             id="newProposalDescription"
             type="text"
             className="form-control"
             placeholder="Proposal Description"
             required />
          <input type="submit"  />
        </form>
        <br></br>
        <h3>Request Amounts</h3>
        <br></br>

        <form onSubmit={(event) => {
          event.preventDefault()
          this.setState({ProposalRequest: event.target[0].value})
          this.setState({RoundDescription: event.target[1].value})
          this.SubmitRequest()
        }}>
        <input
            id="newProposalRequest"
            type="text"
            className="form-control"
            placeholder="Round Request"
            required />
            <input
            id="newProposalRequest"
            type="text"
            className="form-control"
            placeholder="Round Description"
            required />
            <input type="submit"  />
        </form>
       <br></br>
       <h3>Release Funds</h3>
       <br></br>
        <form onSubmit={(event) => {
          event.preventDefault()
          this.setState({ProposalAddress: event.target[0].value})
          this.ReleaseFunds()
        }}>
        <input
            id="newProposalRequest"
            type="text"
            className="form-control"
            placeholder="Proposal Address"
            required />
            <input type="submit"  />
        </form>
        <br></br>
        <h1>Funder Interface</h1>
        <br></br>
        <h3>Fund Proposal</h3>
        <br></br>
        <form onSubmit={(event) => {
          event.preventDefault()
          this.setState({ProposalAddress: event.target[0].value})
          this.setState({FunderAmount: event.target[1].value})
          this.setState({FunderIdentifier: event.target[2].value})
          this.FundProposal()
        }}>
        <input
            id="FunderProposalAddress"
            type="text"
            className="form-control"
            placeholder="Proposal Address"
            required />
            <input
            id="FunderAmount"
            type="text"
            className="form-control"
            placeholder="Amount"
            required />
            <input
            id="FunderIdentifier"
            type="text"
            className="form-control"
            placeholder="Proposal Identifier"
            required />
            <input type="submit"  />

            </form>
            <br></br>
            <h3>Vote on Proposal</h3>
            <form onSubmit={(event) => {
          event.preventDefault()
          this.setState({ProposalAddress: event.target[0].value})
          this.setState({FunderVote: event.target[1].value})
          this.setState({FunderIdentifier: event.target[2].value})
          this.Vote()
        }}>
        <input
            id="FunderProposalAddress"
            type="text"
            className="form-control"
            placeholder="Proposal Address"
            required />
            <input
            id="FunderVote"
            type="text"
            className="form-control"
            placeholder="Vote (1 for positive 0 for negative)"
            required />
            <input
            id="FunderIdentifier"
            type="text"
            className="form-control"
            placeholder="Proposal Identifier"
            required />
            <input type="submit"  />

            </form>
            <br></br>
            <h3>Return Funds</h3>
            <br></br>
            <form onSubmit={(event) => {
          event.preventDefault()
          this.setState({FunderIdentifier: event.target[0].value})
          this.setState({ProposalAddress: event.target[1].value})
          this.ReturnFunds()
        }}>
        <input
            id="newProposalRequest"
            type="text"
            className="form-control"
            placeholder="Funder Identifier"
            required />
        <input
            id="ProposalAddress"
            type="text"
            className="form-control"
            placeholder="Proposal Address"
            required />
            <input type="submit"  />
        </form>

        <br></br>
        <h1>Testing Hash</h1>
        <br></br>
        <form onSubmit={(event) => {
          event.preventDefault()
          
          var string = Web3.utils.sha3(event.target[0].value)
          
          this.setState({HashTest: string})

          var string1 = Web3.utils.sha3(event.target[1].value)

          if(string1==string){
            this.setState({HashStatus: 'statements match'})
          } else {
            this.setState({HashStatus: 'statements do not match'})
          }

        
        }}>
        <input
            id="Hash Test"
            type="text"
            className="form-control"
            placeholder="Hash"
            required />

        <input
            id="Hash Tes"
            type="text"
            className="form-control"
            placeholder="Input"
            required />


<input type="submit"  />
        </form>
        <p> HashTest: {this.state.HashTest} </p>
        <p> HashStatus: {this.state.HashStatus} </p>

    </div>
    )
  }
}

export default App;

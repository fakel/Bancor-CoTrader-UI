import { ABIConverter } from '../../../../../config'
import React, { Component } from 'react'

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'

import UserInfo from '../../../../templates/UserInfo'

class StepThree extends Component {
 addReserve = async (tokenAddress) => {
  const web3 = this.props.MobXStorage.web3
  const accounts = this.props.MobXStorage.accounts
  const converterHash = window.localStorage.getItem('txConverter')
  const converterInfo = await web3.eth.getTransactionReceipt(converterHash)

  if(converterInfo !== null && converterInfo !== "undefined"){
    window.localStorage.setItem('Converter', converterInfo.contractAddress)
    const converter = new web3.eth.Contract(ABIConverter, converterInfo.contractAddress)
    console.log("PARAMS: ", window.localStorage.getItem('userToken'), 500000)
    const gasPrice = this.props.MobXStorage.GasPrice

    converter.methods.addReserve(window.localStorage.getItem('userToken'), 500000).send({
      from:accounts[0],
      gas:1872732,
      gasPrice
    }).on('transactionHash', (hash) => {
     console.log("addConnector hash ", hash)
     window.localStorage.setItem('StepNext', "Four")
     window.localStorage.setItem('txLatest', hash)
     this.props.MobXStorage.setPending(true)
    })
    .on('confirmation', (confirmationNumber, receipt) => {
      this.props.MobXStorage.txFinish()
    })
 }else{
   alert("Converter contract not deployed yet, please wait")
 }
 }

 render() {
   return(
    <Card style={{backgroundColor:'rgba(255,255,255,0.1)'}}>
    <CardContent>
    <Typography variant="h4" gutterBottom component="h4">
    Step 3
    </Typography>
    <Typography variant="body1" className={'mb-2'} component="p">
    <strong>Add connector</strong>
    </Typography>
    <Typography variant="body1" className={'mb-2'} component="p">
    This <UserInfo label="Bancor documentation" info="Existing ERC20 token address, ratio 50% by default"/> step will be done
    </Typography>
    <Typography className={'mt-2 mb-2'} component="div">
    <hr/>
    <Button variant="contained" color="primary" size="medium" onClick={() => this.addReserve()}>add reserve</Button>
    </Typography>
    </CardContent>
  </Card>
  )
}
}

export default StepThree

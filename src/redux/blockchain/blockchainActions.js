import Web3 from "web3"
import LipToken from '../../abis/LipAttack.json'

export const actionTypes = Object.freeze({
  CONNECTION_REQUEST: "CONNECTION_REQUEST",
  CONNECTION_SUCCESS: "CONNECTION_SUCCESS",
  CONNECTION_FAILED: "CONNECTION_FAILED",
  UPDATE_ACCOUNT: "UPDATE_ACCOUNT"
})

const connectRequest = () => ({
  type: actionTypes.CONNECTION_REQUEST
})

const connectSuccess = (payload) => ({
  type: actionTypes.CONNECTION_SUCCESS,
  payload: payload
})

const connectFailed = (msg) => ({
  type: actionTypes.CONNECTION_FAILED,
  payload: msg
})

const updateAccount = (payload) => ({
  type: actionTypes.UPDATE_ACCOUNT,
  payload: payload
})

export const handleConnect = () => {
  return async (dispatch) => {
    dispatch(connectRequest())
    if (window.ethereum) {
      let web3 = new Web3(window.ethereum)
      try {
        // open pop-up request connect with metamask
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts"
        })
        const networkId = await window.ethereum.request({
          method: "net_version"
        })
        if (networkId === '97') { // BSC Testnet
          const lipToken = new web3.eth.Contract(LipToken.abi, "0x656e3C041eD8A85278C8E8B4ccCC457B19D1214a")
          dispatch(connectSuccess({
            account: accounts[0],
            lipToken: lipToken,
            web3: web3
          }))

          // add listeners start
          window.ethereum.on("accountsChanged", (accounts) => {
            dispatch(updateAccount(accounts[0]))
          })
        } else {
          // add listeners end
          dispatch(connectFailed("Change network to BSC Testnet."))
        }
      } catch (error) {
        dispatch(connectFailed('Non-Ethereum browser detected. You should consider trying MetaMask!'))
        console.log('err', error)
      }
    } else {
      console.log('err');
      dispatch(connectFailed('Non-Ethereum browser detected. You should consider trying MetaMask!'))
    }
  }
}

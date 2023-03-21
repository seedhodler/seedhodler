import classes from "./InputWrapper.module.scss"

import CSS from "csstype"

import Link from "assets/icons/Link.svg"
import Wallet from "assets/icons/Wallet.svg"
import Password from "assets/icons/Password.svg"

type Props = {
  children: JSX.Element
  style?: CSS.Properties
}

const InputWrapper: React.FC<Props> = ({ children, style }) => {
  return (
    <div className={classes.inputWrapper}>
      <div className={classes.inputBox}>
        <div style={style} className={classes.inputWallet}>
          <div className={classes.inputItem}>
            <p className={classes.inputInfo}>Wallet name:</p>
            <img src={Wallet} alt="Wallet" className={classes.inputImg} />
          </div>
        </div>
        <div style={style} className={classes.inputPassword}>
          <div className={classes.inputItem}>
            <p className={classes.inputInfo}>Wallet password:</p>
            <img src={Password} alt="Password" className={classes.inputImg} />
          </div>
        </div>
      </div>
      {children}
      <div className={classes.inputBox}>
        <div style={style} className={classes.inputLink}>
          <img src={Link} alt="Link" className={classes.linkImg} />
          <div className={classes.inputInfoBox}>
            <p className={classes.inputLinkTitle}>Seedhodler Website</p>
            <p className={classes.inputLinkInfo}>https://seedhodler.io</p>
          </div>
        </div>
        <div style={style} className={classes.inputContacts}>
          <p className={classes.inputContactsInfo}>if you find this please contact::</p>
        </div>
      </div>
    </div>
  )
}

export default InputWrapper

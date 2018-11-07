import React from 'react'
import { connect } from 'react-redux'
import Header from '../components/header'

const HeaderContainer = () => (
  <Header />
)

export default connect()(HeaderContainer)

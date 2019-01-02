class ButtonContainer extends Component {

  state = {
    isActive: false,
  }

  changeToActive = () => {
    this.setState({
      isActive: true
    })
  }

}

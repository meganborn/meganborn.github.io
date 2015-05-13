var Contact = React.createClass({
  getInitialState () {
    return {
      template: 'button'
    };
  },
  _setTemplate (template) {
    this.setState({template: template});
  },
  _submit (e) {
    e.preventDefault();
    var self = this;
    var name = this.refs.name.getDOMNode().value;
    var email = this.refs.email.getDOMNode().value;
    var zip = this.refs.zip.getDOMNode().value;
    var description = this.refs.description.getDOMNode().value;
    var budget = this.refs.budget.getDOMNode().value;
    var geo = `http://maps.googleapis.com/maps/api/geocode/json?address=${zip}&sensor=true`;

    self._setTemplate('sending');

    $.get(geo).done(function (res) {
      var address = res.results[0].formatted_address || zip;
      if (res.status === 'OK') {
        $.ajax({
          type: 'POST',
          url: 'https://mandrillapp.com/api/1.0/messages/send.json',
          data: {
            key: 'Lr2WVOxCdNzKsHLTdj3VgA',
            message: {
              from_email: email,
              to: [{
                email: 'contact@meganborn.com',
                type: 'to'
              }],
              subject: 'New Contact via MeganBorn.com',
              html: `<h1>${name}</h1><p>${address}</p><h3>Project Description</h3><p>${description}</p><p><b>Approx. Budget:</b> <span style="color:#6cb">${budget}</span></p>`
            }
          }
        }).done(function (response) {
          if (response[0].status === 'sent') {
            self._setTemplate('success');
          } else {
            self._setTemplate('error');
          }
        });
      } else {
        this._setTemplate('error');
      }
    });
  },
  render () {
    var style = {
      button: {
        background: '#6cb',
        borderRadius: 2,
        color: '#fff',
        fontWeight: 600,
        padding: '10px 20px'
      },
      form: {
        maxWidth: 320,
        margin: '30px auto'
      },
      description: { height: 100 },
      submit: {
        width: '100%',
        background: '#6cb',
        borderRadius: 2,
        color: '#fff',
        fontWeight: 600,
        padding: '10px'
      },
      sending: {
        color: '#6cb',
        fontSize: 30,
        lineHeight: 1.2,
        padding: '150px 50px'
      },
      error: {
        color: '#d44',
        fontSize: 20,
        lineHeight: 1.5,
        padding: '150px 50px'
      }
    };
    var templates = {
      button: (
        <button
          onClick={this._setTemplate.bind(null, 'form')}
          style={style.button}
          type="button">Contact Me</button>
      ),
      form: (
        <form onSubmit={this._submit} style={style.form}>
          <input placeholder="Your Name" ref="name" required />
          <input
            placeholder="Email Address"
            ref="email"
            required
            type="email" />
          <input
            maxLength="5"
            placeholder="Zip Code"
            ref="zip"
            required />
          <textarea
            placeholder="Project Description"
            ref="description"
            required
            style={style.description} />
          <input
            placeholder="Approx. Budget"
            ref="budget"
            required />
          <button style={style.submit} type="submit">Submit</button>
        </form>
      ),
      sending: <div style={style.sending}>Sending…</div>,
      success: <div style={style.sending}>Thank you for reaching out! I will get back to you in the next few days.</div>,
      error: <div style={style.error}>Sorry! Something went wrong. :( Please try emailing me directly at <a href="mailto:contact@meganborn.com">contact@meganborn.com</a></div>
    };
    return templates[this.state.template];
  }
});

React.render(<Contact />, document.querySelector('#contact'));
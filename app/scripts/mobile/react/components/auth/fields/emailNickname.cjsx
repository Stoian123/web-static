AuthEmailNicknameField = React.createClass
  displayName: 'AuthEmailNicknameField'

  render: ->
    <div className="auth__field">
      <label htmlFor="auth-nick"
             className="auth__field-icon">
        <i className="icon icon--diary" />
      </label>
      <input ref="input"
             type="text"
             placeholder={ i18n.t('placeholders.auth_nickname') }
             id="auth-nick"
             className="auth__field-input" />
    </div>

  getValue: ->
    @refs.input.getDOMNode().value.trim()

module.exports = AuthEmailNicknameField
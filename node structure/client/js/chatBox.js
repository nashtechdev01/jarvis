// A message, require {content: <message content>, from <0-mine, 1 their (default)}.
var ChatMessage = React.createClass({
    render: function () {
        var className = "";
        if (parseInt(this.props.from) === 0) { // This message from mine.
            return (
                <div className="msg_a_container">
                    <div className="msg_a_avatar">
                        <img
                            src="/pix/icon-user-default.png"
                            alt=""/>
                    </div>
                    <div className="msg_a">
                        {this.props.content}
                    </div>
                </div>

            );
        } else { // This message from their.
            return (
                <div className="msg_b_container">
                    <div className="msg_b_avatar">
                        <img
                            src="/pix/help-desk-icon-8.png"
                            alt=""/>
                    </div>
                    <div className="msg_b" dangerouslySetInnerHTML={{__html: this.props.content }}>

                    </div>
                </div>
            );
        }

    }
})

// The container contain list of messages, require {messages: [CharMessage,...]}.
var ChatContent = React.createClass({
    render: function () {
        var rows = [];
        this.props.messages.forEach(function (message) {
            rows.push(<ChatMessage from={message.from} content={message.content}/>);
        });
        return (
            <div className="msg_body" id="msg_body">
                {rows}
            </div>
        );
    }
})

// The container contain message input.
var ChatInput = React.createClass({
    getInitialState: function () {
        return {content: ""};
    },
    handleKeyUp: function (e) {
        var keyCode = e.keyCode || e.which;
        if (keyCode == 13) {
            this.setState({content: ''});
            this.props.addMessage({content: this.state.content, from: 0});
        }
    },
    handleChange: function (e) {
        this.setState({content: e.target.value});
    },
    render: function () {
        return (
            <div className="msg_footer">
                <div className="icon-area">
                    <div className="icon">
                        <i className="fa fa-microphone" aria-hidden="true"></i>
                    </div>
                </div>
                <textarea
                    x-webkit-speech="x-webkit-speech"
                    className="msg_input"
                    rows="4"
                    value={this.state.content}
                    onKeyUp={this.handleKeyUp}
                    onChange={this.handleChange}
                ></textarea>
            </div>
        );
    }
})

// The container contain chatbox name, service call, hide icon...
var ChatHeader = React.createClass({
    render: function () {
        return (
            <div className="msg_head">
                {this.props.title}
                <div id='chatheader-hide' className="header_item">
                    <i className="fa fa-angle-down" aria-hidden="true"></i>
                </div>
                <div id='chatheader-show' className="header_item" style={{display: 'none'}}>
                    <i className="fa fa-angle-up" aria-hidden="true"></i>
                </div>
                <div className="header_item">
                    <i className="fa fa-phone-square" aria-hidden="true"></i>
                </div>
            </div>
        );
    }
});

// The container contain all the chatbox component.
var ChatBox = React.createClass({
    getInitialState: function () {
        return {messages: []};
    },
    componentDidMount: function () {
        this.initSocket();
        this.initEvent();
        this.setState({messages: []});
    },
    addMessage: function (message) { // message: {content, from}.
        var messages = this.state.messages;
        messages.push(message);
        this.setState({messages: messages});
        // Scroll div to bottom.
        var objDiv = document.getElementById("msg_body");
        objDiv.scrollTop = objDiv.scrollHeight;
    },
    sendMessage: function (callback) { // callback: function.
        // Implement to send ajax message to server using this.props.url
    },
    initSocket: function () { // Init socket to listen from server.
        var self = this;
        var socket = this.props.socket;
        socket.on('push-notification', function (msg) {
            self.addMessage({from: 1, content: msg});
        });
    },
    initEvent: function () {
        $('#chatheader-hide').click(function () {
            $('.msg_wrap').slideToggle('slow');
            $('#chatheader-hide').hide();
            $('#chatheader-show').show();
        });

        $('#chatheader-show').click(function () {
            $('.msg_wrap').slideToggle('slow');
            $('#chatheader-hide').show();
            $('#chatheader-show').hide();
        });
    },
    render: function () {
        return (
            <div className="msg_box" style={{right:"5px"}}>
                <ChatHeader title={this.props.config.title}/>
                <div className="msg_wrap">
                    <ChatContent messages={this.state.messages}/>
                    <ChatInput addMessage={this.addMessage}/>
                </div>
            </div>
        );
    }
})

window.ChatBox = ChatBox;

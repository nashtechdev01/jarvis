var ChatMessage = React.createClass({
    render: function () {
        return (
            <p className="message">
                <span className="name">{this.props.name}</span>
                <span className="content">{this.props.content}</span>
            </p>
        );
    }
})

var ChatLog = React.createClass({
    render: function () {
        var self = this;
        var rows = [];
        self.props.messages.forEach(function (message) {
            rows.push(<ChatMessage name={message.name} content={message.content} />)
        })
        return (
            <div className="chat-log">
                {rows}
            </div>
        );
    }
});

var ChatInput = React.createClass({
    getInitialState: function () {
        return { message: "" };
    },
    handleMessageChange: function (e) {
        this.setState({ message: e.target.value });
    },
    handleMessageKeyUp: function (e) {
        var keyCode = e.keyCode || e.which;
        if (keyCode == 13) {
            if (e.altKey) {
                this.setState({ message: this.state.message + '\n' });
            } else {
                var message = this.state.message;
                var socket = this.props.socket;
                socket.emit('chat message', message);
                this.props.onAddMessage({
                    name: 'User Name',
                    content: message
                });
                this.setState({ message: '' });
            }
        }
    },
    render: function () {
        return (
            <div className="input-message">
                <textarea
                    name="message"
                    cols="30"
                    rows="10"
                    placeholder="Enter a message..."
                    value={this.state.message}
                    onChange={this.handleMessageChange}
                    onKeyUp={this.handleMessageKeyUp}></textarea>
            </div>
        );
    }
});

var ChatboxContent = React.createClass({
    getInitialState: function () {
        return { messages: [] };
    },
    componentDidMount: function () {
        var self = this;
        var socket = this.props.socket;
        socket.on('chat message', function (msg) {
            self.addMessage({ name: 'some other username ', content: msg })
        });
    },
    addMessage: function (message) {
        var messages = this.state.messages;
        messages.push(message);
        this.setState({ messages: messages });
    },
    render: function () {
        return (
            <div className="chat-box-content">
                <ChatLog messages={this.state.messages} />
                <hr />
                <ChatInput socket={this.props.socket} onAddMessage={this.addMessage}/>
            </div>
        );
    }
});

var Chatbox = React.createClass({
    render: function () {
        var socket = io();
        return (
            <div className="chat-box">
                <input type="checkbox" />
                <label data-expanded="Close Chatbox" data-collapsed="Open Chatbox"></label>
                <ChatboxContent socket={socket}/>
            </div>
        );
    }
});

ReactDOM.render(
    <Chatbox/>,
    document.getElementById('content')
);
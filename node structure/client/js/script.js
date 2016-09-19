ReactDOM.render(
    <ChatBox config = { {title: 'Jarvis', url: ''} } socket = {new io()}/>,
    document.getElementById('content')
);

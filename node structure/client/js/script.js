ReactDOM.render(
    <ChatBox config = { {title: 'Chat box', url: ''} } socket = {new io()}/>,
    document.getElementById('content')
);

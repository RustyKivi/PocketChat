const body = document.getElementById('chat');

function renderMessage(_sender,_content, _time)
{
    const message = document.createElement('message');
    const avatar = document.createElement('div');
    avatar.classList.add("avatar");
    const line = document.createElement('div');
    line.classList.add("line")

    const sender = document.createElement('h2');
    sender.textContent = _sender;
    const content = document.createElement('p');
    content.textContent = _content;
    const timeE = document.createElement('p');
    timeE.textContent = _time;
    timeE.classList.add("timestamp");


    message.appendChild(avatar);
    message.appendChild(line);

    line.appendChild(sender);
    line.appendChild(content);
    line.appendChild(timeE);

    body.appendChild(message);
}

function getTimeString()
{
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    const _time = `${hours}:${minutes}`;
    return _time;
}       
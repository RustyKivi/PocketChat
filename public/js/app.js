// Pages.Config //
const Pages = {
    chat:{
        active:true,
        id:"page_chat",
        button:"page_chat_button"
    },
    main:{
        active:false,
        id:"",
        button:"page_main_button"
    },
    setting:{
        active:false,
        id:"",
        button:"page_setting_button"
    },
    account:{
        active:false,
        id:"",
        button:"page_account_button"
    }
}


function notify(content) {
    var x = document.getElementById("snackbar");
    x.className = "show";
    x.textContent = content;
    const _notify = {
        _header:"",
        _content:content,
        _time:getTimeString()
    }
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
    return(_notify)
}
function switchPage(page) {
    if(Pages.hasOwnProperty(page)) {
        for (const pageKey in Pages) {
            if (pageKey === page) {
                Pages[pageKey].active = true;
            } else {
                Pages[pageKey].active = false;
            }
        }
        console.log(`Switched to page: ${page}`);
        console.log(Pages);
        return true;
    } else {
        console.log(`Page '${page}' does not exist.`);
        return false;
    }
}
function toggle(id, s)
{
    const element = document.getElementById(id);
    if(element != null)
    {
        if(s != null)
        {
            if(s === false)
            {
                element.classList.remove("state_show");
                element.classList.add("state_hide");
                return false;
            }else{
                element.classList.add("state_show");
                element.classList.remove("state_hide");
                return true;
            }
        }else{
            if(element.classList.contains("state_show"))
            {
                element.classList.remove("state_show");
                element.classList.add("state_hide");
                return false;
            }else{
                element.classList.add("state_show");
                element.classList.remove("state_hide");
                return true;
            }
        }
    }
}
function chatForm(s)
{
    const form = document.getElementById("controller");
    if(s != null)
    {
        if(s === true)
        {
            form.classList.add("state_show");
            form.classList.remove("state_hide");
        }else{
            form.classList.remove("state_show");
            form.classList.add("state_hide");
        }
    }else{
        if(form.classList.contains("state_hide"))
        {
            form.classList.add("state_show");
            form.classList.remove("state_hide");
            return true;
        }else{
            form.classList.remove("state_show");
            form.classList.add("state_hide");
            return false;
        }
    }
}
function getTimeString()
{
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();

    const _time = `${hours}:${minutes}`;
    return _time;
}

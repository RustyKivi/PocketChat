// Pages.Config //
const Pages = {
    chat:{
        acitve:true,
        id:""
    },
    main:{
        acitve:false,
        id:""
    },
    setting:{
        acitve:false,
        id:""
    },
    account:{
        acitve:false,
        id:""
    }
}


function notify(content) {
    var x = document.getElementById("snackbar");
    x.className = "show";
    x.textContent = content
    setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}
function switchPage(page)
{
    return Pages.hasOwnProperty(pageName);
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

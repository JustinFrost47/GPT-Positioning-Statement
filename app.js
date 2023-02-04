//HTML Dependencies - Just leave these on your components in case you change the frontend
//.Stage, .ReplyWrapper, .ButtonDiv are important dependencies 
//and IDs on forums are crucial dependencies too


const apiUrl = "https://api.openai.com/v1/completions";
const contain = document.querySelector('.ReplyWrapper') ;


// Had the format for parsing json . But currently Not needed
const getReply = (reply) => {
    const rep = reply.choices[0].text;
    console.log(rep);
    return rep; 
}




//Super crucial - does sending query, parsing data, removing loader and inserting reply
const makeReq = async (url, apiKey, req) => {

   try{

    // change tokens to change length of reply
    const param = {model : "text-davinci-003", prompt: `${req}`, temperature: 1, max_tokens: 200};
    const header = {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${apiKey}`
                    }
                } 


    console.log("sending")
    const re = await axios.post(url, param, header);
    const dat = await re.data.choices[0].text;
    //Required output is parsed and  stored in dat, json in re
    console.log(re)
    console.log(dat);
 
    removeStage();
    addElement(dat);
    return dat;
    }
    catch (e) {
    console.log("error occured")
    console.dir(e)
    console.log(e.response.status)

        if(e.response.status===401){

            removeStage();
            addError("Looks like the api key you entered is invalid. Kindly change it and try again");
        }
    }

}



//adds 'content' as div of class stage
const addElement = (content) => {


    let contentStage = document.createElement('div');
    contentStage.classList.toggle('Stage');

    contentStage.innerHTML = `<div class="p-3 bg-info bg-opacity-10 border border-info rounded">${content}</div>`;
    contain.append(contentStage);
}




//adds 'error' alerts
const addError = (content) => {
    
           addElement(`<div class="alert alert-danger alert-dismissible fade show" role="alert">
                <div>${content}</div>
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                </div>`);

}



//Removes first stage element
const removeStage = () => {

    contain.removeChild(document.querySelector('.Stage'));    
    
}


// Structures and returns starter prompts, opt may be used for different type of users in the future
createPrompt = (company, problem, solution, differs, opt) => {

            prompt =`CREATE A ENGAGING AND VIRAL POSITIONING STATEMENT FOR THE GIVEN BRANDS
                    INPUT:
                    Name: Chill Creams
                    Problem: Lack of variety in Icecreams

                    Solutions: Ondemand production of different flavours from inventory

                    Differentiating Factor: Variety and on-demand ice cream preparation

                    OUTPUT:
                    Indulge in a world of flavor with Chill Creams. Say goodbye to boring, limited ice cream options and hello to a new world of possibilities. Our on-demand production allows us to create a variety of delicious flavors from our inventory, so you can have your ice cream, exactly how you like it. Whether you're in the mood for something sweet, salty, or spicy, we've got you covered. Experience the difference with Chill Creams, where every scoop is made just for you.

                    INPUT:
                    Name: ${company} 
                    Problem: ${problem} 

                    Solution: ${solution} 

                    Differentiating Factor: ${differs} 

                    OUTPUT:`; 


        return prompt;
        }


//gets inputs, prepares prompt, calls makeReq() 

    const prepInputs = () => {


    //Getting inputs from forms
    const company = document.querySelector('#name').value;
    const key = document.querySelector('#pass').value;

    const work = document.querySelector('#defn').value;
    const problem = document.querySelector('#problem').value;
    const solution = document.querySelector('#solution').value;
    const differs = document.querySelector('#diff').value;
    


    //The starter prompt, Alter this for better replies
    const sPrompt = createPrompt(company, problem, solution, differs, 1);


    //below makes request to api - comment out during debugging to save tokens

    const reply = makeReq(apiUrl, key, sPrompt); 


     //Test codes - used to see if our application works properly 
/*     console.log('one pass')
    removeStage();
    addElement(sPrompt);  */
                   
}



// The main driver Region


const Button = document.querySelector('.ButtonDiv');

Button.addEventListener('click', (e) => {

    while(document.querySelector('.Stage')) {
        removeStage();
    }
    addElement("Loading...");
    prepInputs();
    

})

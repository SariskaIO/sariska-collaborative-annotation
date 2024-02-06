import { MESSAGING_API_SERVICE_HOST, SARISKA_API_KEY } from "../config";
import {GENERATE_TOKEN_URL, GET_PRESIGNED_URL} from "../constants";
import linkifyHtml from 'linkify-html';

const Compressor = require('compressorjs');

export function getUserId() {
    const characters ='abcdefghijklmnopqrstuvwxyz';
    function generateString(length) {
        let result = ' ';
        const charactersLength = characters.length;
        for ( let i = 0; i < length; i++ ) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return result;
    }
    const str = generateString(9).trim()
    const strArr = str.match(/.{3}/g);
    return strArr.join("-");
}

export const getToken = async (username, userId)=> {
    const body = {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            apiKey: `${SARISKA_API_KEY}`, // enter your app secret,
            user: {
                id: userId,
                name: username
            },
        })
    };

    try {
        const response = await fetch(GENERATE_TOKEN_URL, body);
        if (response.ok) {
            const json = await response.json();
            return json.token;
        } else {
            console.log(response.status);
        }
    } catch (error) {
        console.log(error);
    }

}


export function getPresignedUrl(params) {
    return new Promise((resolve, reject) => {
        const body = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem("SARISKA_CHAT_TOKEN"))}`
            },
            body: JSON.stringify({
                fileType: params.fileType,
                fileName: params.fileName
            })
        };

        fetch(GET_PRESIGNED_URL, body)
            .then((response) => {
                if (response.ok) {
                    return response.json(); //then consume it again, the error happens
                }
            })
            .then(function (response) {
                resolve(response);
            }).catch((error) => {
                console.log(error);
            reject(error)
        })
    });
}

export function formatBytes(bytes) {
    var marker = 1024; // Change to 1000 if required
    var decimal = 3; // Change as required
    var kiloBytes = marker; // One Kilobyte is 1024 bytes
    var megaBytes = marker * marker; // One MB is 1024 KB
    var gigaBytes = marker * marker * marker; // One GB is 1024 MB
    var teraBytes = marker * marker * marker * marker; // One TB is 1024 GB

    // return bytes if less than a KB
    if (bytes < kiloBytes) return bytes + " Bytes";
    // return KB if less than a MB
    else if (bytes < megaBytes) return (bytes / kiloBytes).toFixed(decimal) + " KB";
    // return MB if less than a GB
    else if (bytes < gigaBytes) return (bytes / megaBytes).toFixed(decimal) + " MB";
    // return GB if less than a TB
    else return (bytes / gigaBytes).toFixed(decimal) + " GB";
}


export function compressFile(file, type) {
    return new Promise((resolve, reject) => {
        if (type === "attachment") {
            resolve(file);
        } else {
            new Compressor(file, {
                quality: 0.6,
                success(result) {
                    resolve(result);
                },
                error(err) {
                    reject(err.message);
                }
            });
        }
    });
}

export function getUniqueNumber() {
    return Math.floor(100000 + Math.random() * 900000);
}


export const linkify=(inputText) =>{
    const options = { defaultProtocol: 'https',   target: '_blank'};
    return linkifyHtml(inputText, options);
}

export function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

export const getIntialUpperCaseString = (string) => {
    if(string){
        return string.slice(0,1).toUpperCase()
    }else{
        return ''
    };
}

export const renderAction = (type, payload) => {
    if(payload){
        return {
            type,
            payload
        }
    }else{
        return {
            type
        }
    }
}

export async function apiCall(path, method, body = {}, headers = {}, loader=false) {
    let url = `${MESSAGING_API_SERVICE_HOST}${path}`;
    const requestHeaders = {
        "Content-Type": "application/json", 
        "Authorization": `Bearer ${
            JSON.parse(localStorage.getItem("SARISKA_CHAT_TOKEN"))
        }`,
        ...headers
    };
    if (method.toUpperCase() === "GET" && Object.keys(body).length) {
        const queryString = new URLSearchParams(body).toString();
        url = `${url}?${queryString}`;
    }
    
    const payload = {
        method,
        headers: requestHeaders,
    };
    if (method.toUpperCase() !== "GET" && method.toUpperCase() !== "HEAD") {
        payload.body = JSON.stringify(body);
    }
  
    try {
        const response = await fetch(url, payload);
        if (response.status === 401) {
            console.log('not authenticated');
        }
  
        if (response.status === 403 && method.toUpperCase() !== "GET") {
            console.log('not autherized');
        }
  
        if (response.status === 204) {
            return {};
        }
        if (response.ok) {
            return await response.json();
        }
        return {
            httpStatus: response.status,
            statusText: response.statusText,
            body: await response.json(),
        };
    } catch (error) {
        return {error, httpStatus: 500};
    }
  }

  export const isEmptyObject = (obj) => {
    if(typeof obj !== 'object' ) return false;
    return Object.keys(obj).length === 0;
  };

//   export const pushMessage = (message, options, type, user, setMessages, chatChannel)=>{
     
//       const new_message =  {
//         content: message, 
//         content_type: type, 
//         created_by_name: user.name,  
//         options: options,
//         x: "uu", 
//         y: { x: "ghhg"}
//       };
//       setMessages(messages => [...messages, new_message]);
//       chatChannel.push('new_message', new_message);
//   };
//   export const pushOptions = (option, type, setMessages, chatChannel)=>{
//     const new_option =  {
//       option: option,
//       contentType: type
//     };
//     setMessages(messages => [...messages, new_option]);
//     chatChannel.push('new_option', new_message);
// };
  
  export const adjustTextMessage = (text) => {
    return text.trim();
  };
  
  export const isMessageEmpty = (text, fileAttached) => {
    let textLength = adjustTextMessage(text).length;
    let fileLength = fileAttached.length;
    if (
      (!textLength && fileLength) ||
      (textLength && !fileLength) ||
      (textLength && fileLength)
    ) {
      return false;
    } else {
      return true;
    }
  };

  export const hasDuplicates = (array) => {
    return new Set(array).size !== array.length;
  }

  export const getMaxInArray = (arr) => {
    if(!arr?.length) return 0;
    else return Math.max(...arr);
  }

  export const getSingularOrPlural = (num, text) => {
    return num > 1 ? text + 's' : text;
  }

  export const convertTimestamptoLocalDateTime = (timestamp) => {
    const datetime = new Date(timestamp);
    let time = datetime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: true });
    let date = datetime.toDateString();
    return date +' '+time;
  }
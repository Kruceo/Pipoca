import { coloral as c } from "coloraljs";

const ok = (text)=>{
    console.log(c.markgreen('[  OK  ]'),text)
}

const err = (text)=>{
      console.log(c.markred('[ BAD! ]'),text)
}

const info = (text)=>{
    console.log(c.markblue ('[ INFO ]'),text)
}

export {ok,err,info}
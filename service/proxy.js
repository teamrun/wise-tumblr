import request from 'request';

let errHandler = (err) => {
  if(err){
    console.log(err);
  }
};

export default (url, req) => {
  url = decodeURIComponent(url);
  return req.pipe(request(url, errHandler))
};

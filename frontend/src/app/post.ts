export interface Post {
    _id:string,
    title:string,
    description:string,
    likes:number,
    user: string, //id não nickname
    date:Date,
    photo:string
  }
  
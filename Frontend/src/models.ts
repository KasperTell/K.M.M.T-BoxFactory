export interface Box {

  box_id: number
  product_name: string
  width: number
  height: number
  length: number
  box_img_url: string



}


export class ResponseDto<T>
{
  responseData?: T;
  messageToClient? : string;
}



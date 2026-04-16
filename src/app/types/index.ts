export interface User { _id:string; name:string; email:string; phone?:string; role:string; }
export interface Category { _id:string; name:string; image?:string; slug?:string; }
export interface Brand { _id:string; name:string; image?:string; slug?:string; }
export interface Product {
  _id:string; title:string; slug?:string; description?:string;
  price:number; priceAfterDiscount?:number; imageCover:string; images?:string[];
  ratingsAverage:number; ratingsQuantity:number; sold?:number; quantity?:number;
  category?:Category; brand?:Brand;
}
export interface CartItem { _id:string; product:Product; count:number; price:number; }
export interface Cart { _id:string; cartOwner:string; products:CartItem[]; totalCartPrice:number; totalPriceAfterDiscount?:number; }
export interface ShippingAddress { details:string; phone:string; city:string; }
export interface Order { _id:string; user:User; cartItems:CartItem[]; shippingAddress:ShippingAddress; paymentMethodType:"cash"|"card"; totalOrderPrice:number; isPaid:boolean; isDelivered:boolean; createdAt:string; }
export interface RegisterData { name:string; email:string; password:string; rePassword:string; phone:string; }
export interface LoginData { email:string; password:string; }
export interface ToastState { msg:string; type:"success"|"error"|"warn"|"info"; }

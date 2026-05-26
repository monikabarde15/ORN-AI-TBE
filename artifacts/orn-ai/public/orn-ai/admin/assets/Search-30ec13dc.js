import{R as T,r as f,e as H,s as K,j as o,b as e,L as M,g as S}from"./index-ff12c0bc.js";import{C as L}from"./Highlight-27c1a3aa.js";import{I as E}from"./IconCode-2ed3d35e.js";import{I as z}from"./IconHorizontalDots-721e47cc.js";function _(i,a,d){return(a=function(c){var u=function(h,p){if(typeof h!="object"||!h)return h;var b=h[Symbol.toPrimitive];if(b!==void 0){var m=b.call(h,p||"default");if(typeof m!="object")return m;throw new TypeError("@@toPrimitive must return a primitive value.")}return(p==="string"?String:Number)(h)}(c,"string");return typeof u=="symbol"?u:u+""}(a))in i?Object.defineProperty(i,a,{value:d,enumerable:!0,configurable:!0,writable:!0}):i[a]=d,i}function B(i,a){var d=Object.keys(i);if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(i);a&&(c=c.filter(function(u){return Object.getOwnPropertyDescriptor(i,u).enumerable})),d.push.apply(d,c)}return d}var U=["children","onClickAway","focusEvent","mouseEvent","touchEvent"],A={click:"onClick",focusin:"onFocus",focusout:"onBlur",mousedown:"onMouseDown",mouseup:"onMouseUp",touchstart:"onTouchStart",touchend:"onTouchEnd"},Q=parseInt(T.version.split(".")[0],10),q=function(i){var a=i.children,d=i.onClickAway,c=i.focusEvent,u=c===void 0?"focusin":c,h=i.mouseEvent,p=h===void 0?"click":h,b=i.touchEvent,m=b===void 0?"touchend":b,x=function(l,r){if(l==null)return{};var t,n,g=function(k,G){if(k==null)return{};var $={};for(var C in k)if({}.hasOwnProperty.call(k,C)){if(G.includes(C))continue;$[C]=k[C]}return $}(l,r);if(Object.getOwnPropertySymbols){var F=Object.getOwnPropertySymbols(l);for(n=0;n<F.length;n++)t=F[n],r.includes(t)||{}.propertyIsEnumerable.call(l,t)&&(g[t]=l[t])}return g}(i,U),v=f.useRef(null),N=f.useRef(null),s=f.useRef(!1);f.useEffect(function(){return setTimeout(function(){s.current=!0},0),function(){s.current=!1}},[]);var y,w=function(l){return function(r){N.current=r.target;var t=a==null?void 0:a.props[l];t&&t(r)}},j=null;Q>=19?j=((y=a.props)===null||y===void 0?void 0:y.ref)||null:"ref"in a&&(j=a.ref);var O,J=(O=[v,j],function(l){O.forEach(function(r){typeof r=="function"?r(l):r!=null&&(r.current=l)})});f.useEffect(function(){var l,r,t=(l=(r=v.current)===null||r===void 0?void 0:r.ownerDocument)!==null&&l!==void 0?l:document,n=function(g){s.current&&(v.current&&v.current.contains(g.target)||N.current===g.target||!t.contains(g.target)||d(g))};return t.addEventListener(p,n),t.addEventListener(m,n),t.addEventListener(u,n),function(){t.removeEventListener(p,n),t.removeEventListener(m,n),t.removeEventListener(u,n)}},[u,p,d,m]);var P=A[p],I=A[m],D=A[u];return T.Children.only(f.cloneElement(a,function(l){for(var r=1;r<arguments.length;r++){var t=arguments[r]!=null?arguments[r]:{};r%2?B(Object(t),!0).forEach(function(n){_(l,n,t[n])}):Object.getOwnPropertyDescriptors?Object.defineProperties(l,Object.getOwnPropertyDescriptors(t)):B(Object(t)).forEach(function(n){Object.defineProperty(l,n,Object.getOwnPropertyDescriptor(t,n))})}return l}(_(_(_({ref:J},D,w(D)),P,w(P)),I,w(I)),x)))};q.displayName="ClickAwayListener";const R=[{thumb:"profile-5.jpeg",name:"Alan Green",email:"alan@mail.com",status:"Active",statusClass:"badge badge-outline-primary"},{thumb:"profile-11.jpeg",name:"Linda Nelson",email:"Linda@mail.com",status:"Busy",statusClass:"badge badge-outline-danger"},{thumb:"profile-12.jpeg",name:"Lila Perry",email:"Lila@mail.com",status:"Closed",statusClass:"badge badge-outline-warning"},{thumb:"profile-3.jpeg",name:"Andy King",email:"Andy@mail.com",status:"Active",statusClass:"badge badge-outline-primary"},{thumb:"profile-15.jpeg",name:"Jesse Cory",email:"Jesse@mail.com",status:"Busy",statusClass:"badge badge-outline-danger"}],Z=()=>{const i=H();f.useEffect(()=>{i(K("Search"))});const[a,d]=f.useState([]),[c,u]=f.useState(""),[h,p]=f.useState(R),b=s=>{a.includes(s)?d(y=>y.filter(w=>w!==s)):d([...a,s])};f.useEffect(()=>{p(()=>R.filter(s=>s.name.toLowerCase().includes(c.toLowerCase())||s.email.toLowerCase().includes(c.toLowerCase())))},[c]);const[m,x]=f.useState(!1),v=()=>{x(!0)},N=()=>{x(!1)};return o("div",{children:[o("ul",{className:"flex space-x-2 rtl:space-x-reverse",children:[e("li",{children:e(M,{to:"#",className:"text-primary hover:underline",children:"Elements"})}),e("li",{className:"before:content-['/'] ltr:before:mr-2 rtl:before:ml-2",children:e("span",{children:"Search"})})]}),o("div",{className:"pt-5 grid lg:grid-cols-2 grid-cols-1 gap-6",children:[o("div",{className:"panel lg:row-span-2",id:"live",children:[o("div",{className:"flex items-center justify-between mb-5",children:[e("h5",{className:"font-semibold text-lg dark:text-white-light",children:"Live Search"}),e("button",{onClick:()=>{b("code1")},className:"font-semibold hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-600",children:o("span",{className:"flex items-center",children:[e(E,{className:"me-2"}),"Code"]})})]}),o("div",{className:"mb-5 space-y-5",children:[e("form",{className:"mx-auto w-full sm:w-1/2 mb-5",children:o("div",{className:"relative",children:[e("input",{type:"text",value:c,placeholder:"Search Attendees...",className:"form-input shadow-[0_0_4px_2px_rgb(31_45_61_/_10%)] bg-white rounded-full h-11 placeholder:tracking-wider ltr:pr-11 rtl:pl-11",onChange:s=>u(s.target.value)}),e("button",{type:"button",className:"btn btn-primary absolute ltr:right-1 rtl:left-1 inset-y-0 m-auto rounded-full w-9 h-9 p-0 flex items-center justify-center",children:e(S,{className:"mx-auto"})})]})}),e("div",{className:"p-4 border border-white-dark/20 rounded-lg space-y-4 overflow-x-auto w-full block",children:h.map(s=>o("div",{className:`bg-white dark:bg-[#1b2e4b] rounded-xl shadow-[0_0_4px_2px_rgb(31_45_61_/_10%)] p-3 flex items-center justify-between\r
                                         text-gray-500 font-semibold min-w-[625px] hover:text-primary transition-all duration-300 hover:scale-[1.01]`,children:[e("div",{className:"user-profile",children:e("img",{src:`/assets/images/${s.thumb}`,alt:"img",className:"w-8 h-8 rounded-md object-cover"})}),e("div",{children:s.name}),e("div",{children:s.email}),e("div",{className:`badge ${s.statusClass} border-2 border-dashed`,children:s.status}),e("div",{className:"cursor-pointer",children:e(z,{className:"w-6 h-6 opacity-70"})})]},s.email))})]}),a.includes("code1")&&e(L,{children:e("pre",{children:`import { useState, useEffect } from 'react';

const items = [
    {
        thumb: 'profile-5.jpeg',
        name: 'Alan Green',
        email: 'alan@mail.com',
        status: 'Active',
        statusClass: 'badge badge-outline-primary',
    },
    {
        thumb: 'profile-11.jpeg',
        name: 'Linda Nelson',
        email: 'Linda@mail.com',
        status: 'Busy',
        statusClass: 'badge badge-outline-danger',
    },
    {
        thumb: 'profile-12.jpeg',
        name: 'Lila Perry',
        email: 'Lila@mail.com',
        status: 'Closed',
        statusClass: 'badge badge-outline-warning',
    },
    {
        thumb: 'profile-3.jpeg',
        name: 'Andy King',
        email: 'Andy@mail.com',
        status: 'Active',
        statusClass: 'badge badge-outline-primary',
    },
    {
        thumb: 'profile-15.jpeg',
        name: 'Jesse Cory',
        email: 'Jesse@mail.com',
        status: 'Busy',
        statusClass: 'badge badge-outline-danger',
    },
];

const [search, setSearch] = useState<string>('');
const [filteredItems, setFilteredItems] = useState<any>(items);

useEffect(() => {
        setFilteredItems(() => {
            return items.filter((item) => {
                return item.name.toLowerCase().includes(search.toLowerCase()) || item.email.toLowerCase().includes(search.toLowerCase());
            });
        });
}, [search]);


<div className="mb-5 space-y-5">
    <form className="mx-auto w-full sm:w-1/2 mb-5">
        <div className="relative">
            <input
                type="text"
                value={search}
                placeholder="Search Attendees..."
                className="form-input shadow-[0_0_4px_2px_rgb(31_45_61_/_10%)] bg-white rounded-full h-11 placeholder:tracking-wider ltr:pr-11 rtl:pl-11"
                onChange={(e) => setSearch(e.target.value)}
            />
            <button type="button" className="btn btn-primary absolute ltr:right-1 rtl:left-1 inset-y-0 m-auto rounded-full w-9 h-9 p-0 flex items-center justify-center">
                <svg>...</svg>
            </button>
        </div>
    </form>
    <div className="p-4 border border-white-dark/20 rounded-lg space-y-4 overflow-x-auto w-full block">
        {filteredItems.map((item: any) => {
            return (
                <div
                    key={item.email}
                    className="bg-white dark:bg-[#1b2e4b] rounded-xl shadow-[0_0_4px_2px_rgb(31_45_61_/_10%)] p-3 flex items-center justify-between
                        text-gray-500 font-semibold min-w-[625px] hover:text-primary transition-all duration-300 hover:scale-[1.01]"
                >
                    <div className="user-profile">
                        <img src={\`/assets/images/\${item.thumb}\`} alt="img" className="w-8 h-8 rounded-md object-cover" />
                    </div>
                    <div>{item.name}</div>
                    <div>{item.email}</div>
                    <div className={\`badge \${item.statusClass} border-2 border-dashed\`}>{item.status}</div>
                    <div className="cursor-pointer">
                        <svg>...</svg>
                    </div>
                </div>
            );
        })}
    </div>
</div>`})})]}),o("div",{className:"panel",children:[o("div",{className:"flex items-center justify-between mb-5",children:[e("h5",{className:"font-semibold text-lg dark:text-white-light",children:"Overlay"}),e("button",{onClick:()=>{b("code2")},className:"font-semibold hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-600",children:o("span",{className:"flex items-center",children:[e(E,{className:"me-2"}),"Code"]})})]}),e("div",{className:"mb-5 space-y-5",children:e("form",{children:e(q,{onClickAway:N,children:o("div",{className:"search-form-overlay relative border border-white-dark/20 rounded-md h-12 w-full",onClick:v,children:[e("input",{type:"text",placeholder:"Search...",className:`form-input bg-white h-full placeholder:tracking-wider hidden ltr:pl-12 rtl:pr-12 peer ${m?"!block":""}`}),e("button",{type:"button",className:`text-dark/70 absolute ltr:right-1 rtl:left-1 inset-y-0 my-auto w-9 h-9 p-0 flex items-center justify-center peer-focus:text-primary ${m?"!ltr:!right-auto ltr:left-1 rtl:right-1":""}`,children:e(S,{className:"mx-auto w-5 h-5"})})]})})})}),a.includes("code2")&&e(L,{children:e("pre",{children:`import { useState} from 'react';

const [focus, setFocus] = useState(false);

const overlayClickAway = () => {
    setFocus(false);
};

<form>
    <ClickAwayListener onClickAway={overlayClickAway}>
        <div className="search-form-overlay relative border border-white-dark/20 rounded-md h-12 w-full" onClick={overlaySearchClick}>
            <input
                type="text"
                placeholder="Search..."
                className={\`form-input bg-white h-full placeholder:tracking-wider hidden ltr:pl-12 rtl:pr-12 peer ${m?"!block":""}\`}
            />
            <button
                type="button"
                className={\`text-dark/70 absolute ltr:right-1 rtl:left-1 inset-y-0 my-auto w-9 h-9 p-0 flex items-center justify-center peer-focus:text-primary ${m?"!ltr:!right-auto ltr:left-1 rtl:right-1":""}\`}
            >
                <svg>...</svg>
            </button>
        </div>
    </ClickAwayListener>
</form>`})})]}),o("div",{className:"panel",children:[o("div",{className:"flex items-center justify-between mb-5",children:[e("h5",{className:"font-semibold text-lg dark:text-white-light",children:"Search Box"}),e("button",{onClick:()=>{b("code3")},className:"font-semibold hover:text-gray-400 dark:text-gray-400 dark:hover:text-gray-600",children:o("span",{className:"flex items-center",children:[e(E,{className:"me-2"}),"Code"]})})]}),e("div",{className:"mb-5 space-y-5",children:e("form",{children:o("div",{className:"relative border border-white-dark/20  w-full flex",children:[e("button",{type:"submit",placeholder:"Let's find your question in fast way",className:"text-primary m-auto p-3 flex items-center justify-center",children:e(S,{className:"mx-auto w-5 h-5"})}),e("input",{type:"text",placeholder:"Let's find your question in fast way",className:"form-input border-0 border-l rounded-none bg-white  focus:shadow-[0_0_5px_2px_rgb(194_213_255_/_62%)] dark:shadow-[#1b2e4b] placeholder:tracking-wider focus:outline-none py-3"})]})})}),a.includes("code3")&&e(L,{children:e("pre",{children:`import { useState} from 'react';
import ClickAwayListener from 'react-click-away-listener';

const [focus, setFocus] = useState(false);

const overlaySearchClick = () => {
        setFocus(true);
};

<form>
    <div className="relative border border-white-dark/20  w-full flex">
        <button type="submit" placeholder="Let's find your question in fast way" className="text-primary m-auto p-3 flex items-center justify-center">
            <svg>...</svg>
        </button>
        <input
            type="text"
            placeholder="Let's find your question in fast way"
            className="form-input border-0 border-l rounded-none bg-white  focus:shadow-[0_0_5px_2px_rgb(194_213_255_/_62%)] dark:shadow-[#1b2e4b] placeholder:tracking-wider focus:outline-none py-3"
        />
    </div>
</form>`})})]})]})]})};export{Z as default};

import{r as s,j as d,b as e,a as _}from"./index-ff12c0bc.js";import{h as P}from"./html2pdf-8b04599a.js";import"./html2canvas.esm-19160bb3.js";const S="/api/v1/admin/payments/",N=5,E=()=>{const[u,$]=s.useState([]),[l,f]=s.useState([]),[v,b]=s.useState(!1),[i,D]=s.useState(""),[c,w]=s.useState(1),[x,I]=s.useState(0),y=async(t=1)=>{b(!0);try{const a=await _.get(`${S}?page=${t}`),r=a.data.results||[],n=a.data.count||r.length;$(r),f(r),I(n),w(t)}catch(a){console.error("Error fetching payments:",a)}finally{b(!1)}};s.useEffect(()=>{y(1)},[]),s.useEffect(()=>{if(!i.trim()){f(u);return}f(u.filter(t=>(t.order_id||"").toLowerCase().includes(i.toLowerCase())||(t.payment_id||"").toLowerCase().includes(i.toLowerCase())))},[i,u]);const m=Math.ceil(x/N),p=t=>{t<1||t>m||y(t)},C=()=>{const t=[["ID","Order ID","Payment ID","Amount","Status","Refund ID","Refund Status","Created At"],...l.map(n=>[n.id,n.order_id,n.payment_id||"-",n.amount,n.status,n.refund_id||"-",n.refund_status||"-",new Date(n.created_at).toLocaleString()])].map(n=>n.map(o=>`"${o}"`).join(",")).join(`
`),a=new Blob([t],{type:"text/csv"}),r=document.createElement("a");r.href=URL.createObjectURL(a),r.download="Payments_Table.csv",r.click()},L=()=>{const t=document.createElement("table");t.innerHTML=`
      <thead>
        <tr>
          <th>ID</th>
          <th>Order ID</th>
          <th>Payment ID</th>
          <th>Amount</th>
          <th>Status</th>
          <th>Refund ID</th>
          <th>Refund Status</th>
          <th>Created At</th>
        </tr>
      </thead>
      <tbody>
        ${l.map(a=>`
          <tr>
            <td>${a.id}</td>
            <td>${a.order_id}</td>
            <td>${a.payment_id||"-"}</td>
            <td>${a.amount}</td>
            <td>${a.status}</td>
            <td>${a.refund_id||"-"}</td>
            <td>${a.refund_status||"-"}</td>
            <td>${new Date(a.created_at).toLocaleString()}</td>
          </tr>`).join("")}
      </tbody>
    `,P().set({margin:10,filename:"Payments_Table.pdf",image:{type:"jpeg",quality:.98},html2canvas:{scale:2},jsPDF:{unit:"pt",format:"a4",orientation:"landscape"}}).from(t).save()},g=async(t,a)=>{try{const n=(await _.get(`${S}${t}/`)).data,o=document.createElement("div");if(o.style.padding="20px",o.innerHTML=`
        <h2 style="text-align:center;">Invoice #${n.id}</h2>
        <p><strong>Order ID:</strong> ${n.order_id}</p>
        <p><strong>Payment ID:</strong> ${n.payment_id||"-"}</p>
        <p><strong>Amount:</strong> ${n.amount}</p>
        <p><strong>Status:</strong> ${n.status}</p>
        <p><strong>Refund ID:</strong> ${n.refund_id||"-"}</p>
        <p><strong>Refund Status:</strong> ${n.refund_status||"-"}</p>
        <p><strong>Created At:</strong> ${new Date(n.created_at).toLocaleString()}</p>
      `,a==="print"){const h=window.open("","","width=700,height=700");h.document.write(`
          <html>
            <head><title>Invoice</title></head>
            <body>${o.innerHTML}</body>
          </html>
        `),h.document.close(),h.focus(),h.print()}else P().set({margin:10,filename:`Invoice_${n.id}.pdf`,image:{type:"jpeg",quality:.98},html2canvas:{scale:2},jsPDF:{unit:"pt",format:"a4",orientation:"portrait"}}).from(o).save()}catch(r){console.error("Invoice fetch error:",r)}};return d("div",{children:[d("div",{className:"flex flex-wrap justify-between items-center gap-3 mb-4",children:[e("input",{type:"text",placeholder:"Search payments...",className:"form-input py-2 px-3 border rounded",value:i,onChange:t=>D(t.target.value)}),d("div",{className:"flex gap-2",children:[e("button",{className:"btn btn-sm btn-primary",onClick:C,children:"Export CSV"}),e("button",{className:"btn btn-sm btn-primary",onClick:L,children:"Export PDF"})]})]}),e("div",{className:"overflow-x-auto",children:d("table",{className:"table table-striped table-hover w-full",children:[e("thead",{children:d("tr",{children:[e("th",{children:"ID"}),e("th",{children:"Order ID"}),e("th",{children:"Payment ID"}),e("th",{children:"Amount"}),e("th",{children:"Status"}),e("th",{children:"Refund ID"}),e("th",{children:"Refund Status"}),e("th",{children:"Created At"}),e("th",{children:"Actions"})]})}),e("tbody",{children:v?e("tr",{children:e("td",{colSpan:9,className:"text-center py-4",children:"Loading..."})}):l.length===0?e("tr",{children:e("td",{colSpan:9,className:"text-center py-4 text-muted",children:"No records found"})}):l.map(t=>d("tr",{children:[e("td",{children:t.id}),e("td",{children:t.order_id}),e("td",{children:t.payment_id||"-"}),e("td",{children:t.amount}),e("td",{children:t.status}),e("td",{children:t.refund_id||"-"}),e("td",{children:t.refund_status||"-"}),e("td",{children:new Date(t.created_at).toLocaleString()}),d("td",{children:[e("button",{className:"btn btn-sm btn-primary me-1",onClick:()=>g(t.id,"print"),children:"Print"}),e("button",{className:"btn btn-sm btn-success",onClick:()=>g(t.id,"download"),children:"PDF"})]})]},t.id))})]})}),m>1&&d("div",{className:"flex justify-center mt-4 gap-1 flex-wrap",children:[e("button",{className:"btn btn-sm btn-outline-primary",disabled:c===1,onClick:()=>p(c-1),children:"Prev"}),Array.from({length:m},(t,a)=>a+1).map(t=>e("button",{className:`btn btn-sm ${c===t?"btn-primary":"btn-outline-primary"}`,onClick:()=>p(t),children:t},t)),e("button",{className:"btn btn-sm btn-outline-primary",disabled:c===m,onClick:()=>p(c+1),children:"Next"})]})]})};export{E as default};

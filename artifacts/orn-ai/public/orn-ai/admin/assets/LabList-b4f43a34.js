import{r as c,j as l,b as e,a as _}from"./index-ff12c0bc.js";import{h as P}from"./html2pdf-8b04599a.js";import"./html2canvas.esm-19160bb3.js";console.log("https://orn-ai-all-bakcned.onrender.com");const v="https://orn-ai-all-bakcned.onrender.com",y=`${v}/api/v1/admin/instances/`,k=5,U=()=>{const[p,N]=c.useState([]),[i,b]=c.useState([]),[g,f]=c.useState(!1),[d,w]=c.useState(""),[o,D]=c.useState(1),[S,I]=c.useState(0),m=async(t=1)=>{f(!0);try{const n=await _.get(`${y}?page=${t}`),a=n.data.results||[],r=n.data.count||a.length;N(a),b(a),I(r),D(t)}catch(n){console.error("Error fetching instances:",n)}finally{f(!1)}};c.useEffect(()=>{m(o)},[]),c.useEffect(()=>{b(p.filter(t=>{var n,a,r;return((n=t.userName)==null?void 0:n.toLowerCase().includes(d.toLowerCase()))||((a=t.instance_type)==null?void 0:a.toLowerCase().includes(d.toLowerCase()))||((r=t.instance_ip)==null?void 0:r.toLowerCase().includes(d.toLowerCase()))}))},[d,p]);const h=Math.ceil(S/k),u=t=>{t<1||t>h||m(t)},L=async t=>{if(window.confirm("Are you sure you want to delete this instance?"))try{await _.delete(`${y}${t}/`),alert("Instance deleted successfully!"),m(o)}catch(n){console.error("Delete failed:",n),alert("Failed to delete instance.")}},x=()=>{let n=["ID","User Name","Instance Type","Instance Size","User ID","IP","Status","Processing","Deleted","Comments","Hours","Rent Date","Timestamp"].join(",")+`
`;i.forEach(s=>{n+=[s.user_instance_id,s.userName,s.instance_type,s.instance_size,s.userId,s.instance_ip,s.status,s.processing_status?"Yes":"No",s.isDeleted?"Yes":"No",s.comments||"-",s.hours,new Date(s.rentDate).toLocaleString(),new Date(s.timestamp).toLocaleString()].join(",")+`
`});const a=new Blob([n],{type:"text/csv"}),r=document.createElement("a");r.href=URL.createObjectURL(a),r.download="LabList.csv",r.click()},C=()=>{const t=document.createElement("table");t.innerHTML=`
      <thead>
        <tr>
          <th>ID</th>
          <th>User Name</th>
          <th>Instance Type</th>
          <th>Instance Size</th>
          <th>User ID</th>
          <th>IP</th>
          <th>Status</th>
          <th>Processing</th>
          <th>Deleted</th>
          <th>Comments</th>
          <th>Hours</th>
          <th>Rent Date</th>
          <th>Timestamp</th>
        </tr>
      </thead>
      <tbody>
        ${i.map(n=>`
          <tr>
            <td>${n.user_instance_id}</td>
            <td>${n.userName}</td>
            <td>${n.instance_type}</td>
            <td>${n.instance_size}</td>
            <td>${n.userId}</td>
            <td>${n.instance_ip}</td>
            <td>${n.status}</td>
            <td>${n.processing_status?"Yes":"No"}</td>
            <td>${n.isDeleted?"Yes":"No"}</td>
            <td>${n.comments||"-"}</td>
            <td>${n.hours}</td>
            <td>${new Date(n.rentDate).toLocaleString()}</td>
            <td>${new Date(n.timestamp).toLocaleString()}</td>
          </tr>`).join("")}
      </tbody>
    `,P().set({margin:10,filename:"LabList.pdf",html2canvas:{scale:2},jsPDF:{unit:"pt",format:"a4",orientation:"landscape"}}).from(t).save()},$=t=>{window.open(t,"_blank")};return l("div",{children:[l("div",{className:"flex flex-wrap justify-between items-center gap-3 mb-4",children:[e("input",{type:"text",placeholder:"Search instances...",className:"form-input py-2 px-3 border rounded",value:d,onChange:t=>w(t.target.value)}),l("div",{className:"flex gap-2",children:[e("button",{className:"btn btn-sm btn-primary",onClick:x,children:"Export CSV"}),e("button",{className:"btn btn-sm btn-primary",onClick:C,children:"Export PDF"})]})]}),e("div",{className:"overflow-x-auto",children:l("table",{className:"table table-striped table-hover w-full",children:[e("thead",{children:l("tr",{children:[e("th",{children:"ID"}),e("th",{children:"User Name"}),e("th",{children:"Instance Type"}),e("th",{children:"Instance Size"}),e("th",{children:"User ID"}),e("th",{children:"IP"}),e("th",{children:"Status"}),e("th",{children:"Processing"}),e("th",{children:"Deleted"}),e("th",{children:"Comments"}),e("th",{children:"Hours"}),e("th",{children:"Rent Date"}),e("th",{children:"Timestamp"}),e("th",{children:"Actions"})]})}),e("tbody",{children:g?e("tr",{children:e("td",{colSpan:14,className:"text-center py-4",children:"Loading..."})}):i.length===0?e("tr",{children:e("td",{colSpan:14,className:"text-center py-4",children:"No records found"})}):i.map(t=>l("tr",{children:[e("td",{children:t.user_instance_id}),e("td",{children:t.userName}),e("td",{children:t.instance_type}),e("td",{children:t.instance_size}),e("td",{children:t.userId}),e("td",{children:t.instance_ip}),e("td",{children:t.status}),e("td",{children:t.processing_status?"Yes":"No"}),e("td",{children:t.isDeleted?"Yes":"No"}),e("td",{children:t.comments||"-"}),e("td",{children:t.hours}),e("td",{children:new Date(t.rentDate).toLocaleString()}),e("td",{children:new Date(t.timestamp).toLocaleString()}),l("td",{className:"flex gap-1 flex-wrap",children:[e("button",{className:"btn btn-sm btn-danger",onClick:()=>L(t.user_instance_id),children:"Delete"}),t.web_ssh_url&&e("button",{className:"btn btn-sm btn-warning",onClick:()=>$(t.web_ssh_url),children:"SSH"})]})]},t.user_instance_id))})]})}),h>1&&l("div",{className:"flex justify-center mt-4 gap-1 flex-wrap",children:[e("button",{className:"btn btn-sm btn-outline-primary",disabled:o===1,onClick:()=>u(o-1),children:"Prev"}),Array.from({length:h},(t,n)=>n+1).map(t=>e("button",{className:`btn btn-sm ${o===t?"btn-primary":"btn-outline-primary"}`,onClick:()=>u(t),children:t},t)),e("button",{className:"btn btn-sm btn-outline-primary",disabled:o===h,onClick:()=>u(o+1),children:"Next"})]})]})};export{U as default};

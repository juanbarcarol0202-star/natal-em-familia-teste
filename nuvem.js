import {initializeApp} from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js';
import {getAuth,signInAnonymously,signInWithPopup,GoogleAuthProvider,onAuthStateChanged,signOut} from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js';
import {getFirestore,doc,setDoc,getDoc,getDocs,collection,runTransaction,serverTimestamp} from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js';
const config={apiKey:'AIzaSyBpslquHIkyYQ053R3puamnjd4RrHDYv_Y',authDomain:'natal-em-familia-2026-299ca.firebaseapp.com',projectId:'natal-em-familia-2026-299ca',storageBucket:'natal-em-familia-2026-299ca.firebasestorage.app',messagingSenderId:'816484930431',appId:'1:816484930431:web:cbbc352336a34394b1004a'};
const app=initializeApp(config),auth=getAuth(app),db=getFirestore(app),admin='juanbarcarol0202@gmail.com';
const ready=new Promise(resolve=>{const unsub=onAuthStateChanged(auth,u=>{unsub();resolve(u)})});
async function identidade(){await ready;if(!auth.currentUser)await signInAnonymously(auth);return auth.currentUser}
function isAdmin(u){return u?.email===admin && u?.emailVerified===true}
async function mandar(pessoa,resposta){const u=await identidade();await setDoc(doc(db,'respostas',u.uid+'_'+pessoa),{uid:u.uid,pessoa,resposta,atualizado:serverTimestamp()});}
async function entrar(){await ready;const result=await signInWithPopup(auth,new GoogleAuthProvider());if(!isAdmin(result.user))throw Error('Use a conta Google pessoal da organização.');return result.user}
async function listar(){const u=await identidade();if(!isAdmin(u))throw Error('Entre com a conta da organização.');const snap=await getDocs(collection(db,'respostas'));return snap.docs.map(d=>d.data())}
async function lerSorteio(){const u=await identidade();if(!isAdmin(u))throw Error('Entre com a conta da organização.');const snap=await getDoc(doc(db,'sorteios','atual'));return snap.exists()?snap.data():null}
async function criarSorteio(pares){const u=await identidade();if(!isAdmin(u))throw Error('Entre com a conta da organização.');const ref=doc(db,'sorteios','atual');await runTransaction(db,async tx=>{if((await tx.get(ref)).exists())throw Error('Já existe um sorteio registrado.');tx.set(ref,{pares,criadoEm:serverTimestamp()})})}
async function lerDecisoes(){const u=await identidade();if(!isAdmin(u))throw Error('Entre com a conta da organização.');const snap=await getDoc(doc(db,'organizacao','decisoes'));return snap.exists()?snap.data():{}}
async function salvarDecisao(field,value){const u=await identidade();if(!isAdmin(u)||!['tipo','faixa'].includes(field))throw Error('Decisão inválida.');await setDoc(doc(db,'organizacao','decisoes'),{[field]:value},{merge:true})}
async function sair(){await signOut(auth)}
window.NatalCloud={mandar,entrar,listar,sair,lerSorteio,criarSorteio,lerDecisoes,salvarDecisao};

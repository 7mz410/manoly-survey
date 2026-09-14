import {questions,type Answers} from './questions';
export type SurveyRecord={name:string;answers:Answers};
export const EXTRA_OPTIONS=['غير متأكد','خيار آخر'];
export const LEGACY_OPTION='غير متأكد / خيار آخر';
export const LEGACY_PALETTE_OPTIONS=['أسود وأحمر','خشبي وعاجي','أخضر داكن وعاجي','كحلي ورمادي','أسود وأبيض'];
export function summarize(records:SurveyRecord[]){return questions.map(q=>{const answered=records.filter(p=>!!p.answers[q.id]?.choice).length;const labels=[...q.options.map(o=>o.label),...EXTRA_OPTIONS];const historical=records.map(p=>p.answers[q.id]?.choice).filter((choice):choice is string=>!!choice&&!labels.includes(choice));labels.push(...Array.from(new Set(historical)));const options=labels.map(label=>{const count=records.filter(p=>p.answers[q.id]?.choice===label).length;return {label,count,percentage:answered?count/answered:null};});return {id:q.id,title:q.title,chapter:q.chapter,answered,missing:records.length-answered,total:records.length,options};});}
export const percent=(n:number|null)=>n===null?'—':new Intl.NumberFormat('ar',{style:'percent',maximumFractionDigits:1}).format(n);
export function responseTable(records:SurveyRecord[]){return [['اسم المشارك',...questions.flatMap((q,i)=>[`${i+1}. ${q.title}`,`${i+1}. التفسير / الشروط`])],...records.map(p=>[p.name,...questions.flatMap(q=>[p.answers[q.id]?.choice||'',p.answers[q.id]?.note||''])])];}
export function summaryTable(records:SurveyRecord[]){return [['السؤال','الخيار','عدد الاختيارات','عدد المجيبين عن السؤال','النسبة من المجيبين','إجابات ناقصة','إجمالي المشاركين'],...summarize(records).flatMap(q=>[...q.options.map(o=>[q.title,o.label,o.count,q.answered,o.percentage===null?'':o.percentage,q.missing,q.total]),[q.title,'لم يُجب',q.missing,q.answered,'',q.missing,q.total]])];}
export function csv(table:(string|number)[][]){return '\uFEFF'+table.map(row=>row.map(v=>'"'+(typeof v==='string'&&/^[\s]*[=+@-]/.test(v)?"'"+v:String(v)).replace(/"/g,'""')+'"').join(',')).join('\r\n');}

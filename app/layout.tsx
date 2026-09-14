import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={title:'منولي | اكتشاف هوية العلامة',description:'استبيان تفاعلي لاكتشاف شخصية علامة منولي وألوانها واتجاهها للسنوات الخمس القادمة.',icons:{icon:'/favicon.svg'}};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="ar" dir="rtl"><body>{children}</body></html>}

// "use client";
// import Link from 'next/link';

// export default function ManagerLayout({ children }: { children: React.ReactNode }) {
//   const navItems = [
//     { href: '/manager/category', label: 'Danh Mục' },
//     { href: '/manager/user', label: 'Người Dùng' },
//     { href: '/manager/dish', label: 'Món Ăn' },
//     // Thêm các mục mới ở đây trong tương lai
//   ];

//   return (
//     <div className="flex min-h-screen bg-[#1B1B1B] text-white">
//       {/* Sidebar */}
//       <aside className="w-64 bg-[#2A2A2A] p-4">
//         <h2 className="text-xl font-bold mb-4">Bảng Điều Khiển Quản Lý</h2>
//         <nav>
//           <ul>
//             {navItems.map((item) => (
//               <li key={item.href} className="mb-2">
//                 <Link href={item.href} className="block p-2 hover:bg-[#3A3A3A] rounded">
//                   {item.label}
//                 </Link>
//               </li>
//             ))}
//           </ul>
//         </nav>
//       </aside>
//       {/* Nội dung chính */}
//       <main className="flex-1 p-6">
//         {children}
//       </main>
//     </div>
//   );
// }

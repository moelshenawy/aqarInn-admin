import i18n from '@/lib/i18n'

function getToastDirection() {
  return i18n.resolvedLanguage === 'ar' ? 'rtl' : 'ltr'
}

const dir = getToastDirection()
const isRTL = dir === 'rtl'

export function DashboardProgressTable({ rows }) {
  return (
    <section
      dir={dir}
      className="rounded-xl border border-[color:var(--dashboard-border)] bg-[#f8f3e8] shadow-[var(--dashboard-shadow)]"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-4 bg-[#EAE5D7] px-6 py-4">
        <h2 className="text-start text-lg font-semibold text-[color:var(--dashboard-text)]">
          إجمالي فرص الاستثمار
        </h2>
        <p className="rounded-full bg-white px-3 py-1 text-xs font-medium text-[color:var(--dashboard-text-soft)] shadow-[var(--dashboard-shadow)]">
          137 فرصة
        </p>
      </div>

      {/* Table */}
      <div className="border-t border-[color:var(--dashboard-border)] px-4 pt-3 pb-4">
        {/* Head */}
        <div
          className={`flex items-center gap-4 px-2 pb-3 text-xs font-medium text-[color:var(--dashboard-text-soft)] ${isRTL ? 'flex-row' : 'flex-row-reverse'}`}
        >
          <span className="w-[84px] shrink-0 text-start">الحالة</span>
          <span className="w-[72px] shrink-0 text-start">العدد</span>
          <span className="flex-1"></span>
        </div>

        {/* Rows */}
        <div className="space-y-5">
          {rows.map((row) => (
            <div
              key={row.key}
              className={`flex items-center gap-4 px-2 ${
                isRTL ? 'flex-row' : 'flex-row-reverse'
              }`}
            >
              {/* Text (right in RTL / left in LTR) */}
              <span className="w-[84px] shrink-0 text-start text-xs font-medium text-[color:var(--dashboard-text)]">
                {row.label}
              </span>

              <span className="w-[72px] shrink-0 text-start text-xs font-medium text-[color:var(--dashboard-text)]">
                {row.count}
              </span>

              {/* Progress (left in RTL / right in LTR) */}
              <div className="flex-1 overflow-hidden rounded-full bg-[#efe8d8]">
                <div
                  className={`h-2 rounded-full bg-[#876647] ${
                    isRTL ? 'ml-auto' : 'mr-auto'
                  }`}
                  style={{ width: `${row.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
// import i18n from '@/lib/i18n'
// function getToastDirection() {
//   return i18n.resolvedLanguage === 'ar' ? 'rtl' : 'ltr'
// }
// const dir = getToastDirection()

// export function DashboardProgressTable({ rows }) {
//   return (
//     <section
//       dir={dir}
//       className="rounded-xl border border-[color:var(--dashboard-border)] bg-[#f8f3e8] shadow-[var(--dashboard-shadow)]"
//     >
//       <div className="flex items-center justify-between gap-4 bg-[#EAE5D7] px-6 py-4">
//         <h2 className="text-right text-lg leading-7 font-semibold text-[color:var(--dashboard-text)]">
//           إجمالي فرص الاستثمار
//         </h2>
//         <p className="rounded-full bg-white px-3 py-1 text-xs leading-[18px] font-medium text-[color:var(--dashboard-text-soft)] shadow-[var(--dashboard-shadow)]">
//           137 فرصة
//         </p>
//       </div>
//       <div className="border-t border-[color:var(--dashboard-border)] px-4 pt-3 pb-4">
//         <div className="px-grid d-flex items-center gap-x-4 px-2 pb-3 text-xs leading-5 font-medium text-[color:var(--dashboard-text-soft)]">
//           <span className="text-right"> </span>
//           <span className="text-right">العدد</span>
//           <span className="text-right">الحالة</span>
//         </div>
//         <div className="space-y-5">
//           {rows.map((row) => (
//             <div key={row.key} className="-flex items-center gap-x-4 px-2">
//               <div className="h-2 rounded-full bg-[#efe8d8]">
//                 <div
//                   className="h-2 rounded-full bg-[#876647]"
//                   style={{ width: `${row.progress}%` }}
//                 />
//               </div>
//               <span className="text-right text-xs leading-5 font-medium text-[color:var(--dashboard-text)]">
//                 {row.count}
//               </span>
//               <span className="text-right text-xs leading-5 font-medium text-[color:var(--dashboard-text)]">
//                 {row.label}
//               </span>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   )
// }

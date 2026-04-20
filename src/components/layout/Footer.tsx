export function Footer() {
  return (
    <footer className="bg-[#EEEEEB] dark:bg-stone-950 w-full mt-20 tonal background shift to surface_container grid grid-cols-1 md:grid-cols-3 gap-12 px-8 py-16 max-w-[1440px] mx-auto">
      <div>
        <div className="text-lg font-semibold tracking-tighter text-stone-900 dark:text-stone-50 mb-4 font-[Inter_Tight]">
          Planora
        </div>
        <p className="text-[#5B5B58] dark:text-stone-400">
          © 2024 Planora. All rights reserved.
        </p>
      </div>
      <div className="flex flex-col gap-3">
        <a className="text-[#5B5B58] dark:text-stone-400 hover:underline decoration-[#3B2BFF] underline-offset-4" href="#">About</a>
        <a className="text-[#5B5B58] dark:text-stone-400 hover:underline decoration-[#3B2BFF] underline-offset-4" href="#">Contact</a>
        <a className="text-[#5B5B58] dark:text-stone-400 hover:underline decoration-[#3B2BFF] underline-offset-4" href="#">Legal</a>
      </div>
      <div>
        <a className="text-[#3B2BFF] hover:underline decoration-[#3B2BFF] underline-offset-4 font-medium" href="#">Subscribe to updates</a>
      </div>
    </footer>
  );
}
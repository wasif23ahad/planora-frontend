"use client";

export default function EventsPage() {
  return (
    <>
      {/* TopNavBar */}
      <nav className="bg-[#FAFAF7] dark:bg-stone-900 docked full-width top-0 sticky z-50">
        <div className="flex justify-between items-center w-full px-8 py-4 max-w-[1440px] mx-auto border-b border-stone-200 dark:border-stone-800">
          <div className="text-2xl font-semibold tracking-tighter text-stone-900 dark:text-stone-50">
            Planora
          </div>
          <div className="hidden md:flex gap-8 items-center font-[Inter_Tight] font-semibold tracking-tighter uppercase text-sm">
            <a className="text-[#3B2BFF] border-b-2 border-[#3B2BFF] pb-1 hover:opacity-80 transition-opacity" href="/events">
              Events
            </a>
            <a className="text-[#5B5B58] dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:opacity-80 transition-opacity" href="/about">
              About
            </a>
          </div>
          <div className="hidden md:flex gap-4 items-center">
            <a className="text-[#3B2BFF] dark:text-[#3B2BFF] font-[Inter_Tight] font-semibold tracking-tighter uppercase text-sm hover:opacity-80 transition-opacity" href="/login">
              Log In
            </a>
            <a className="bg-primary-container text-on-primary px-4 py-2 rounded-lg font-[Inter_Tight] font-semibold tracking-tighter uppercase text-sm hover:opacity-80 transition-opacity" href="/register">
              Sign Up
            </a>
          </div>
        </div>
      </nav>

      <main className="flex-grow w-full max-w-[1440px] mx-auto px-8 py-16 grid grid-cols-1 md:grid-cols-12 gap-16">
        {/* Sidebar Filters */}
        <aside className="md:col-span-3 space-y-12">
          <div>
            <h2 className="text-2xl font-semibold mb-6">Filters</h2>
            <div className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-semibold text-on-surface">Category</h3>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input checked className="form-checkbox h-5 w-5 text-primary-container border-outline-variant rounded focus:ring-primary-container" type="checkbox"/>
                  <span className="text-secondary text-sm">Public Free</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input checked className="form-checkbox h-5 w-5 text-primary-container border-outline-variant rounded focus:ring-primary-container" type="checkbox"/>
                  <span className="text-secondary text-sm">Public Paid</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input className="form-checkbox h-5 w-5 text-primary-container border-outline-variant rounded focus:ring-primary-container" type="checkbox"/>
                  <span className="text-secondary text-sm">Private Free</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input className="form-checkbox h-5 w-5 text-primary-container border-outline-variant rounded focus:ring-primary-container" type="checkbox"/>
                  <span className="text-secondary text-sm">Private Paid</span>
                </label>
              </div>
              <div className="space-y-4 pt-6 border-t border-surface-container-high">
                <h3 className="font-semibold text-on-surface">Fee Range</h3>
                <input className="w-full accent-primary-container" max="500" min="0" type="range" value="150"/>
                <div className="flex justify-between text-sm text-secondary">
                  <span>$0</span>
                  <span>$150+</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <section className="md:col-span-9 space-y-12">
          {/* Header & Search */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div>
              <h1 className="text-5xl font-semibold mb-2">All events</h1>
              <p className="text-secondary text-lg">48 events found</p>
            </div>
            <div className="w-full md:w-96 flex gap-4 items-center">
              <div className="relative w-full">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-secondary">search</span>
                <input className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg pl-12 pr-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-colors" placeholder="Search events..." type="text"/>
              </div>
              <select className="bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 text-sm text-on-surface focus:border-primary outline-none appearance-none cursor-pointer">
                <option>Nearest date</option>
                <option>Recently added</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <article className="bg-surface-container-lowest rounded-xl ghost-border overflow-hidden flex flex-col h-full hover:-translate-y-1 transition-transform duration-300">
              <div className="aspect-video relative bg-surface-container-high">
                <img alt="Jazz musicians playing instruments" className="w-full h-full object-cover" data-alt="close-up of a jazz saxophone player in a dimly lit club with warm ambient lighting and a moody atmosphere" src="https://lh3.googleusercontent.com/aida-public/AB6AXuD4pM9Katt9fan2cVch3zFWBmEsIpu6BgOUIofHQanFv2qQpK5ZaVJXykb7_RAvpFJinaEYrEj3wdW1W8Hnm3wB1dbsVKoQo5BNx17Y5FO0R_7H8RGEaMVeppIURqsKpBWR1YDo3-brCapbzTMUuTVnmyLNz1Zxm68ho8GEmib8_U39ygnN1QmDUQjd8wtLybFKZ7cB236xy32xsrbppAU1GEhKIG6ah-LVU9cQmS_QizOwnttYi5z8pdYRdoNroFc11QhPqYXdM0vE"/>
                <span className="absolute top-4 left-4 px-3 py-1 bg-[#EAF4EC] text-[#1F5F3E] text-xs font-semibold uppercase tracking-wider rounded-full">Public Free</span>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="text-sm text-secondary mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">calendar_today</span>
                  <span>Oct 24 • 8:00 PM</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 line-clamp-2">Late Night Jazz Session</h3>
                <div className="text-sm text-secondary mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">location_on</span>
                  <span className="truncate">The Blue Note Room, NYC</span>
                </div>
                <div className="mt-auto flex justify-between items-center pt-4 border-t border-surface-container-high">
                  <span className="text-sm font-medium text-secondary">Free Entry</span>
                  <button className="text-primary-container font-semibold text-sm hover:underline">Details</button>
                </div>
              </div>
            </article>
            {/* Card 2 */}
            <article className="bg-surface-container-lowest rounded-xl ghost-border overflow-hidden flex flex-col h-full hover:-translate-y-1 transition-transform duration-300">
              <div className="aspect-video relative bg-surface-container-high">
                <img alt="People gardening" className="w-full h-full object-cover" data-alt="a bright sunny rooftop garden with people planting seedlings in wooden raised beds, vibrant green foliage and clear blue sky" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxF8-pyTmk4kCzZD8VCWRIouqEM0l1zShYJD-NWYTjvyG-XOB7oZ8eLROf4d9VchZkmoO3wJMdikN1SgXdHPSdxD0ZlOOmncFIya25y6wqjeM8e67X05fT9s0AD2SxRMUepwIKcaAKdosJGWQHm9Dggy3hikVDK6J9nLDzHssaviYdWDhzfmE9xOM3quNc_WfAvzNQM3qCDZUVXQVAThSxP2xMM9OzdZXZ4F6Cpq7ELAQhImirvN1ROnyXcfg269sobToD_OJP73a0"/>
                <span className="absolute top-4 left-4 px-3 py-1 bg-[#F0E9F7] text-[#3B2BFF] text-xs font-semibold uppercase tracking-wider rounded-full">Public Paid</span>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="text-sm text-secondary mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">calendar_today</span>
                  <span>Oct 26 • 10:00 AM</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 line-clamp-2">Urban Garding Workshop</h3>
                <div className="text-sm text-secondary mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">location_on</span>
                  <span className="truncate">Brooklyn Botanic Garden</span>
                </div>
                <div className="mt-auto flex justify-between items-center pt-4 border-t border-surface-container-high">
                  <span className="text-sm font-medium text-on-surface">$45.00</span>
                  <button className="text-primary-container font-semibold text-sm hover:underline">Details</button>
                </div>
              </div>
            </article>
            {/* Card 3 */}
            <article className="bg-surface-container-lowest rounded-xl ghost-border overflow-hidden flex flex-col h-full hover:-translate-y-1 transition-transform duration-300">
              <div className="aspect-video relative bg-surface-container-high">
                <img alt="People in a meeting" className="w-full h-full object-cover" data-alt="modern glass-walled conference room with young professionals discussing a presentation on a screen, bright natural light" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC9GYpTTBs8dl7d9o7H5ERJXRiG5eeJ3oSlXHy8-BdE3Y9oVTBSybV0G1zoUvBFDZ43y-ysaFFNsgktHCXiigmVhEecOgG10CtKt0-J0l1KOOlj_wmmbWTgpqul-CRc0qx7KOOiGHBgXXKCtp-c16SILexzin_JzDooTErzDIf7G6EwkYrzhDjqUedQLj1rLtJV5nk09FD_bzfIlgbjROURCqVnNCqCOOofLCbFNpbc4OwUWGGE9LYvfF3ljUsO4sY3tBzWrkeFLXui"/>
                <span className="absolute top-4 left-4 px-3 py-1 bg-[#F5F1E8] text-[#6B5719] text-xs font-semibold uppercase tracking-wider rounded-full">Private Free</span>
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <div className="text-sm text-secondary mb-2 flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">calendar_today</span>
                  <span>Nov 02 • 6:30 PM</span>
                </div>
                <h3 className="text-xl font-semibold mb-2 line-clamp-2">SaaS Founders Meetup</h3>
                <div className="text-sm text-secondary mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-base">location_on</span>
                  <span className="truncate">TechHub SF</span>
                </div>
                <div className="mt-auto flex justify-between items-center pt-4 border-t border-surface-container-high">
                  <span className="text-sm font-medium text-secondary">Invite Only</span>
                  <button className="text-primary-container font-semibold text-sm hover:underline">Details</button>
                </div>
              </div>
            </article>
          </div>

          {/* Pagination */}
          <div className="flex justify-center items-center gap-2 pt-16">
            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant text-secondary hover:bg-surface-container-low transition-colors">
              <span className="material-symbols-outlined">chevron_left</span>
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary-container text-on-primary font-semibold">1</button>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant text-on-surface hover:bg-surface-container-low transition-colors font-semibold">2</button>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant text-on-surface hover:bg-surface-container-low transition-colors font-semibold">3</button>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant text-on-surface hover:bg-surface-container-low transition-colors font-semibold">4</button>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant text-on-surface hover:bg-surface-container-low transition-colors font-semibold">5</button>
            <span className="text-secondary px-2">...</span>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant text-on-surface hover:bg-surface-container-low transition-colors font-semibold">8</button>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg border border-outline-variant text-secondary hover:bg-surface-container-low transition-colors">
              <span className="material-symbols-outlined">chevron_right</span>
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#EEEEEB] dark:bg-stone-950 w-full mt-20 tonal background shift to surface_container">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 px-8 py-16 max-w-[1440px] mx-auto font-[Inter] text-sm leading-relaxed">
          <div>
            <div className="text-lg font-semibold tracking-tighter text-stone-900 dark:text-stone-50 mb-4">Planora</div>
            <p className="text-[#5B5B58] dark:text-stone-400">© 2024 Planora. All rights reserved.</p>
          </div>
          <div className="flex flex-col gap-3">
            <a className="text-[#5B5B58] dark:text-stone-400 hover:underline decoration-[#3B2BFF] underline-offset-4" href="#">About</a>
            <a className="text-[#5B5B58] dark:text-stone-400 hover:underline decoration-[#3B2BFF] underline-offset-4" href="#">Contact</a>
            <a className="text-[#5B5B58] dark:text-stone-400 hover:underline decoration-[#3B2BFF] underline-offset-4" href="#">Legal</a>
          </div>
          <div>
            <a className="text-[#3B2BFF] hover:underline decoration-[#3B2BFF] underline-offset-4 font-medium" href="#">Subscribe to updates</a>
          </div>
        </div>
      </footer>
    </>
  );
}
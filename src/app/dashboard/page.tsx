"use client";

import Link from "next/link";

export default function DashboardPage() {
  return (
    <>
      {/* TopNavBar */}
      <nav className="bg-[#FAFAF7] dark:bg-stone-900 docked full-width top-0 sticky z-50 transition-all border-b border-stone-200 dark:border-stone-800 flat no shadows flex justify-between items-center w-full px-8 py-4 max-w-[1440px] mx-auto hidden md:flex">
        <div className="flex items-center gap-12">
          <a className="text-2xl font-semibold tracking-tighter text-stone-900 dark:text-stone-50 font-[Inter_Tight]" href="/">
            Planora
          </a>
          <div className="hidden md:flex gap-8">
            <a className="font-[Inter_Tight] font-semibold tracking-tighter uppercase text-sm text-[#5B5B58] dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:opacity-80 transition-opacity" href="/events">
              Events
            </a>
            <a className="font-[Inter_Tight] font-semibold tracking-tighter uppercase text-sm text-[#5B5B58] dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:opacity-80 transition-opacity" href="/about">
              About
            </a>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <a className="font-[Inter_Tight] font-semibold tracking-tighter uppercase text-sm text-[#5B5B58] dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100 hover:opacity-80 transition-opacity" href="/login">
            Log In
          </a>
          <a className="font-[Inter_Tight] font-semibold tracking-tighter uppercase text-sm text-[#3B2BFF] dark:text-[#3B2BFF] hover:opacity-80 transition-opacity" href="/register">
            Sign Up
          </a>
        </div>
      </nav>

      {/* Layout Shell */}
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 py-12 flex flex-col md:flex-row gap-12 min-h-[calc(100vh-80px-200px)]">
        {/* Sidebar */}
        <aside className="w-full md:w-64 shrink-0 flex flex-col gap-2">
          <nav className="flex flex-col gap-1">
            <a className="flex items-center gap-3 px-4 py-3 border-l-4 border-primary bg-surface-container-low text-on-surface font-medium rounded-r-lg transition-colors" href="/dashboard">
              <span className="material-symbols-outlined text-primary" data-icon="event" data-weight="fill" style={{ fontVariationSettings: "'FILL' 1" }}>
                event
              </span>
              <span className="font-body">My Events</span>
            </a>
            <a className="flex items-center gap-3 px-4 py-3 border-l-4 border-transparent text-secondary hover:bg-surface-container-low hover:text-on-surface rounded-r-lg transition-colors" href="/invitations">
              <span className="material-symbols-outlined" data-icon="mail">
                mail
              </span>
              <span className="font-body">Invitations</span>
            </a>
            <a className="flex items-center gap-3 px-4 py-3 border-l-4 border-transparent text-secondary hover:bg-surface-container-low hover:text-on-surface rounded-r-lg transition-colors" href="/reviews">
              <span className="material-symbols-outlined" data-icon="reviews">
                reviews
              </span>
              <span className="font-body">Reviews</span>
            </a>
            <a className="flex items-center gap-3 px-4 py-3 border-l-4 border-transparent text-secondary hover:bg-surface-container-low hover:text-on-surface rounded-r-lg transition-colors mt-8" href="/settings">
              <span className="material-symbols-outlined" data-icon="settings">
                settings
              </span>
              <span className="font-body">Settings</span>
            </a>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 max-w-[1040px]">
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-12">
            <div>
              <h1 className="font-headline font-semibold text-4xl tracking-tighter text-on-surface">
                My Events
              </h1>
              <p className="font-body text-secondary mt-2">
                Manage your upcoming and past events.
              </p>
            </div>
            <Link href="/dashboard/events/new">
              <button className="bg-primary-container text-on-primary font-label font-semibold uppercase tracking-wider text-sm px-6 py-3 rounded-lg hover:opacity-90 transition-opacity bg-gradient-to-r from-primary to-primary-container flex items-center gap-2">
                <span className="material-symbols-outlined text-lg" data-icon="add">
                  add
                </span>
                Create event
              </button>
            </Link>
          </header>

          {/* Data Table / List */}
          <div className="bg-surface-container-lowest rounded-xl border border-outline-variant/20 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-body text-sm border-collapse">
                <thead className="bg-surface-container-low border-b border-outline-variant/20">
                  <tr>
                    <th className="px-6 py-4 font-semibold text-on-surface">Title</th>
                    <th className="px-6 py-4 font-semibold text-on-surface">Date</th>
                    <th className="px-6 py-4 font-semibold text-on-surface">Status</th>
                    <th className="px-6 py-4 font-semibold text-on-surface text-right">Participants</th>
                    <th className="px-6 py-4 font-semibold text-on-surface text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/20">
                  {/* Sample event rows - in a real app, this would come from API */}
                  <tr className="hover:bg-surface-container-low/50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="font-medium text-on-surface">Intro to Weaving Workshop</div>
                      <div className="text-secondary text-xs mt-1">Creative Arts Center</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="font-headline font-semibold text-on-surface">Oct 24, 2024</div>
                      <div className="text-secondary text-xs mt-1">10:00 AM - 1:00 PM</div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#EAF4EC] text-[#1F5F3E] border border-[#1F5F3E]/20 uppercase tracking-wider">
                        Approved
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right font-headline font-semibold text-on-surface">
                      12/20
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="text-secondary hover:text-primary transition-colors flex items-center gap-1 font-medium">
                          <span className="material-symbols-outlined text-[20px]" data-icon="edit">
                            edit
                          </span>
                          Edit
                        </button>
                        <button className="text-secondary hover:text-primary transition-colors flex items-center gap-1 font-medium ml-4">
                          <span className="material-symbols-outlined text-[20px]" data-icon="settings">
                            settings
                          </span>
                          Manage
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-container-low/50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="font-medium text-on-surface">Downtown Startup Mixer</div>
                      <div className="text-secondary text-xs mt-1">The Innovation Hub</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="font-headline font-semibold text-on-surface">Nov 05, 2024</div>
                      <div className="text-secondary text-xs mt-1">6:00 PM - 9:00 PM</div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#F0E9F7] text-[#3B2BFF] border border-[#3B2BFF]/20 uppercase tracking-wider">
                        Featured
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right font-headline font-semibold text-on-surface">
                      84/150
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="text-secondary hover:text-primary transition-colors flex items-center gap-1 font-medium">
                          <span className="material-symbols-outlined text-[20px]" data-icon="edit">
                            edit
                          </span>
                          Edit
                        </button>
                        <button className="text-secondary hover:text-primary transition-colors flex items-center gap-1 font-medium ml-4">
                          <span className="material-symbols-outlined text-[20px]" data-icon="settings">
                            settings
                          </span>
                          Manage
                        </button>
                      </div>
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-container-low/50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="font-medium text-on-surface">Private Investors Briefing</div>
                      <div className="text-secondary text-xs mt-1">Virtual Conference</div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="font-headline font-semibold text-on-surface">Nov 12, 2024</div>
                      <div className="text-secondary text-xs mt-1">2:00 PM - 3:30 PM</div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-[#F5F1E8] text-[#6B5719] border border-[#6B5719]/20 uppercase tracking-wider">
                        Pending
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right font-headline font-semibold text-on-surface">
                      4/10
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="text-secondary hover:text-primary transition-colors flex items-center gap-1 font-medium">
                          <span className="material-symbols-outlined text-[20px]" data-icon="edit">
                            edit
                          </span>
                          Edit
                        </button>
                        <button className="text-secondary hover:text-primary transition-colors flex items-center gap-1 font-medium ml-4">
                          <span className="material-symbols-outlined text-[20px]" data-icon="settings">
                            settings
                          </span>
                          Manage
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination (Mock) */}
          <div className="flex items-center justify-between mt-8 text-sm font-body">
            <span className="text-secondary">Showing 1 to 3 of 12 events</span>
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant/20 text-secondary hover:bg-surface-container-low transition-colors disabled:opacity-50" disabled>
                <span className="material-symbols-outlined text-[18px]" data-icon="chevron_left">
                  chevron_left
                </span>
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg bg-surface-container-low text-on-surface font-medium border border-outline-variant/20">
                1
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-low text-secondary transition-colors border border-transparent hover:border-outline-variant/20">
                2
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-surface-container-low text-secondary transition-colors border border-transparent hover:border-outline-variant/20">
                3
              </button>
              <button className="w-8 h-8 flex items-center justify-center rounded-lg border border-outline-variant/20 text-secondary hover:bg-surface-container-low transition-colors">
                <span className="material-symbols-outlined text-[18px]" data-icon="chevron_right">
                  chevron_right
                </span>
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <footer className="bg-[#EEEEEB] dark:bg-stone-950 w-full mt-20 tonal background shift to surface_container flat no shadows grid grid-cols-1 md:grid-cols-3 gap-12 px-8 py-16 max-w-[1440px] mx-auto">
        <div className="flex flex-col gap-4">
          <span className="text-lg font-semibold tracking-tighter text-stone-900 dark:text-stone-50 font-[Inter_Tight]">
            Planora
          </span>
          <p className="font-[Inter] text-sm leading-relaxed text-[#5B5B58] dark:text-stone-400">
            © 2024 Planora. All rights reserved.
          </p>
        </div>
        <div className="flex flex-col gap-4">
          <h4 className="font-headline font-semibold text-on-surface">
            Company
          </h4>
          <div className="flex flex-col gap-2">
            <a className="font-[Inter] text-sm leading-relaxed text-[#5B5B58] dark:text-stone-400 hover:underline decoration-[#3B2BFF] underline-offset-4" href="#">
              About
            </a>
            <a className="font-[Inter] text-sm leading-relaxed text-[#5B5B58] dark:text-stone-400 hover:underline decoration-[#3B2BFF] underline-offset-4" href="#">
              Contact
            </a>
            <a className="font-[Inter] text-sm leading-relaxed text-[#5B5B58] dark:text-stone-400 hover:underline decoration-[#3B2BFF] underline-offset-4" href="#">
              Legal
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
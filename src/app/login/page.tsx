"use client";

export default function LoginPage() {
  return (
    <>
      <div className="w-full max-w-[400px] bg-surface-container-lowest rounded-xl border border-outline-variant/20 ambient-shadow p-8 flex flex-col items-center">
        {/* Brand / Header */}
        <div className="text-center mb-8">
          <h1 className="font-headline text-3xl font-semibold text-on-surface mb-2">
            Planora
          </h1>
          <p className="font-body text-secondary text-sm">
            Manage your community with confidence.
          </p>
        </div>
        
        {/* Form */}
        <form action="#" className="w-full space-y-6" method="POST">
          <div className="space-y-4">
            {/* Email Field */}
            <div>
              <label className="block font-label text-xs font-semibold text-on-surface mb-1.5 label-text" htmlFor="email">
                Email Address
              </label>
              <input className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-4 py-3 text-on-surface font-body text-sm placeholder-secondary focus:outline-none focus:ring-0 focus:border-primary focus:border-2 transition-colors duration-200" 
                    id="email" name="email" placeholder="hello@planora.com" required type="email"/>
            </div>
            
            {/* Password Field */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block font-label text-xs font-semibold text-on-surface label-text" htmlFor="password">
                  Password
                </label>
                <a className="font-body text-xs text-primary hover:text-primary-container transition-colors duration-200" href="#">
                  Forgot?
                </a>
              </div>
              <input className="w-full bg-surface-container-lowest border border-outline-variant/20 rounded-lg px-4 py-3 text-on-surface font-body text-sm placeholder-secondary focus:outline-none focus:ring-0 focus:border-primary focus:border-2 transition-colors duration-200" 
                    id="password" name="password" placeholder="••••••••" required type="password"/>
            </div>
          </div>
          
          {/* Submit Button */}
          <button className="w-full primary-gradient-btn text-on-primary font-body font-medium text-sm py-3 px-4 rounded-lg hover:opacity-90 transition-opacity duration-200" type="submit">
            Log In
          </button>
        </form>
        
        {/* Footer Link */}
        <div className="mt-6 text-center">
          <p className="font-body text-sm text-secondary">
            Don't have an account? 
            <a className="text-primary hover:text-primary-container font-medium transition-colors duration-200 underline decoration-primary underline-offset-4 hover:opacity-80" href="/register">
              Sign up
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
import { FacebookIcon, InstagramIcon, PhoneIcon } from "./icons";

export default function TopBar() {
  return (
    <div className="bg-slate-900 text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2 text-xs">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 opacity-90">
            <PhoneIcon className="h-4 w-4" />
            <span>(11) 2256-9500</span>
          </div>
          <div className="flex items-center gap-2 opacity-90">
            <PhoneIcon className="h-4 w-4" />
            <span>(11) 94467-2883</span>
          </div>
        </div>

        <div className="flex items-center gap-3 opacity-90">
          <a className="hover:opacity-100" href="#" aria-label="Instagram">
            <InstagramIcon className="h-4 w-4" />
          </a>
          <a className="hover:opacity-100" href="#" aria-label="Facebook">
            <FacebookIcon className="h-4 w-4" />
          </a>
        </div>
      </div>
    </div>
  );
}

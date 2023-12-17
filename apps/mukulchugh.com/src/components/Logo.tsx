import clsx from 'clsx';

interface LogoProps {
  active?: boolean;
}

function Logo({ active = false }: LogoProps) {
  return (
    <div className={clsx('flex items-center gap-1.5 font-[1000] leading-none')}>
      <div
        className={clsx(
          'border-box flex items-center justify-center rounded-xl border-2',
          'h-10 w-10 sm:h-8 sm:w-8 sm:rounded-lg',
          active
            ? 'border-accent-600 bg-accent-600 dark:border-accent-500 dark:bg-accent-500'
            : 'border-accent-600 dark:border-accent-500'
        )}
      >
        <svg
          className={clsx('h-8 w-8 sm:h-6 sm:w-6', {
            'dark:text-slate-300': !active,
            'text-white': active,
          })}
          version="1.0"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="-80 -25 1150 950"
          preserveAspectRatio="xMidYMid meet"
        >
          <g
            transform="translate(0.000000, 888.000000) scale(0.100000, -0.100000)"
            fill={active ? '#fff' : 'rgb(var(--tw-ta-accent-500)'}
            stroke="none"
          >
            <path d="M506 8839 c-6 -41 -507 -8832 -503 -8835 1 -2 421 111 932 250 l930 253 217 2879 c179 2384 214 2882 204 2899 -16 25 -1767 2579 -1771 2584 -2 1 -6 -12 -9 -30z" />
            <path d="M8340 7185 l-1205 -1154 3 -53 c12 -221 413 -5832 417 -5836 4 -4 1947 593 1962 603 3 2 34 7587 31 7590 -2 2 -545 -516 -1208 -1150z" />
            <path d="M3170 5935 c0 -11 1642 -2745 1649 -2745 4 0 314 584 689 1298 l682 1297 -78 8 c-42 4 -678 36 -1412 72 -734 35 -1379 67 -1432 71 -54 3 -98 3 -98 -1z" />
          </g>
        </svg>
      </div>

      <div className={clsx('-mt-1 hidden text-xl', 'sm:block')}>
        <span className={clsx('text-slate-900', 'dark:text-slate-200')}>
          mukul
        </span>
        <span className={clsx('text-accent-600', 'dark:text-accent-500')}>
          chugh
        </span>
      </div>
    </div>
  );
}

export default Logo;

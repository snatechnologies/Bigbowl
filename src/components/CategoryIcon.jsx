/** Simple stroke icons for the three catalogue categories. */
const PATHS = {
  'onboarding-gifts': (
    <>
      <rect x="6" y="14" width="36" height="26" rx="3" />
      <path d="M6 22h36M24 14v26M24 14s-6-1.5-6-5.5S24 4 24 8s6-4 6 .5S24 14 24 14Z" />
    </>
  ),
  'festival-gifts': (
    <>
      <path d="M24 6l3.6 7.6 8.4 1.2-6 5.9 1.4 8.3-7.4-3.9-7.4 3.9 1.4-8.3-6-5.9 8.4-1.2L24 6Z" />
      <path d="M10 40h28M14 44h20" />
    </>
  ),
  'office-utilities': (
    <>
      <rect x="8" y="16" width="32" height="24" rx="3" />
      <path d="M18 16v-4a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v4M8 26h32" />
    </>
  ),
};

export default function CategoryIcon({ slug, size = 28 }) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {PATHS[slug] || PATHS['office-utilities']}
    </svg>
  );
}

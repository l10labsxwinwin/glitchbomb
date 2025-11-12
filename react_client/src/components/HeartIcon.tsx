import * as React from 'react'

export default function HeartIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg 
      width="11" 
      height="11" 
      viewBox="0 0 11 11" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
    >
      <path d="M10.2359 1.86079V5.58161H9.30473V6.51277H8.37509V7.4424H7.44394V8.37356H6.51278V9.3032H5.58389V10.2344H4.65199V9.3032H3.7231V8.37356H2.79195V7.4424H1.86231V6.51277H0.931155V5.58161H0V1.86079H0.931155V0.929638H1.86231V0H3.7231V0.929638H4.65199V1.86079H5.58389V0.929638H6.51278V0H8.37507V0.929638H9.30471V1.86079H10.2359Z" fill="#55DD63"/>
    </svg>
  )
}


const KaizenLoading = () => (
  <div>
    改善
    <style jsx>
      {`
        div {
          grid-area: projects;
          animation-name: color;
          animation-duration: 2s;
          animation-iteration-count: infinite;
          font-size: 64px;
          display: grid;
          justify-content: center;
          align-content: center;
          max-height: 100%;
        }

        @keyframes color {
          0% {
            color: var(--fg);
          }
          50% {
            color: var(--highlight);
          }
          100 {
            color: var(--fg);
          }
        }
      `}
    </style>
  </div>
);

export default KaizenLoading;

type props;
let default: props => React.element;
let getServerSideProps:
  'a =>
  Js.Promise.t({. "props": {. "projects": array(ProjectsApi.project)}});

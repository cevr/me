[@val] external set: (string, Js.Json.t) => unit = "localStorage.setItem";
[@val] external remove: string => unit = "localStorage.removeItem";

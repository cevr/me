[@val] [@scope "localStorage"]
external set: (string, Js.Json.t) => unit = "localStorage.setItem";
[@val] [@scope "localStorage"]
external remove: string => unit = "localStorage.removeItem";

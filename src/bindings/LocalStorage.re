[@val] [@scope "localStorage"]
external set: (string, Js.Json.t) => unit = "setItem";
[@val] [@scope "localStorage"]
external remove: string => unit = "removeItem";

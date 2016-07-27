(ns web-generator.core
  (:require [web-generator.html-generation.core :as html-generation])
  (:gen-class))

(defn -main
  [& args]
  (println (spit "../index.html" (html-generation/index-html) :append false)))

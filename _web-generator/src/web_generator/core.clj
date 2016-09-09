(ns web-generator.core
  (:require [web-generator.html-generation.core :as html-generation])
  (:gen-class))

(defn -main
  [& args]
  (spit "../index.html" (html-generation/index-html) :append false)
  (spit "../resume.html" (html-generation/resume-html) :append false))

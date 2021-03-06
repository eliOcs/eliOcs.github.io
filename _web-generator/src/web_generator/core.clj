(ns web-generator.core
  (:require [web-generator.html-generation.core :as html-generation]))

(defn -main
  [& args]
  (spit "../index.html" (html-generation/index-html) :append false)
  (spit "../resume.html" (html-generation/resume-html) :append false)
  (spit "../interesting-content.html" (html-generation/interesting-content-html) :append false)
  (System/exit 0))

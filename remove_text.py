# -*- coding: utf-8 -*-
import os

f = os.path.join(os.path.dirname(__file__), "src/pages/Service.jsx")
with open(f, "r", encoding="utf-8") as file:
    lines = file.readlines()

out = []
skip = False
for line in lines:
    if "Used by companies" in line:
        # Find the closing tag
        depth = 0
        for l in lines:
            if l.strip().startswith("<b>"):
                depth += 1
            elif l.strip().startswith("</b>"):
                depth -= 1
            if depth == 0 and "</b>" in l:
                break
        skip = True
    elif skip and "</b>" in line:
        skip = False
    elif not skip:
        out.append(line)

with open(f, "w", encoding="utf-8") as file:
    file.writelines(out)

print("Removed the text block")

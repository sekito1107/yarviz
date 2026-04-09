# Get Ruby Version
puts "Ruby Version: #{RUBY_VERSION}"

# Compile and print YARV
code = "1 + 1"
yarv = RubyVM::InstructionSequence.compile(code).to_a
require 'json'
puts "--- YARV START ---"
puts JSON.generate(yarv)
puts "--- YARV END ---"

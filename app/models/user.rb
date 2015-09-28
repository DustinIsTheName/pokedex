class User < ActiveRecord::Base
	serialize :minesweeper_scores, Array

	def full_name
		first_name + " " + last_name
	end

	has_secure_password
end

class User < ActiveRecord::Base
	serialize :minesweeper_scores, Array
	validates :first_name, presence: true
	validates :last_name, presence: true
	validates :email, presence: true
	validates :password_digest, presence: true

	def full_name
		first_name + " " + last_name
	end

	has_secure_password
end

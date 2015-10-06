module ApplicationHelper
	
	def flash_class(type)
		case type.to_s
		when 'alert'
			"alert-error"
		when 'notice'
			"alert-success"
		else
			""
		end
	end

end

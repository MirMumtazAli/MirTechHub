using DAL.UnitOfWork;
using Microsoft.AspNetCore.Mvc;

namespace MTHAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SoftwareController : ControllerBase
    {
        private readonly IUnitOfWork _unitOfWork;

        public SoftwareController(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var softwares = await _unitOfWork.Softwares.GetAllAsync();
            return Ok(softwares);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var software = await _unitOfWork.Softwares.GetByIdAsync(id);
            if (software == null) return NotFound();

            return Ok(software);
        }

        [HttpPost]
        public async Task<IActionResult> Create(Software software)
        {
            software.CreatedAt = DateTime.UtcNow;

            await _unitOfWork.Softwares.AddAsync(software);
            await _unitOfWork.CompleteAsync();

            return Ok(software);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, Software updated)
        {
            var software = await _unitOfWork.Softwares.GetByIdAsync(id);
            if (software == null) return NotFound();

            software.Name = updated.Name;
            software.Description = updated.Description;
            software.TechStack = updated.TechStack;
            software.Price = updated.Price;
            software.IsFree = updated.IsFree;
            software.SourceCodeUrl = updated.SourceCodeUrl;
            software.DemoUrl = updated.DemoUrl;

            _unitOfWork.Softwares.Update(software);
            await _unitOfWork.CompleteAsync();

            return NoContent();
        }

        // SOFT DELETE
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var software = await _unitOfWork.Softwares.GetByIdAsync(id);
            if (software == null) return NotFound();

            _unitOfWork.Softwares.SoftDelete(software);
            await _unitOfWork.CompleteAsync();

            return NoContent();
        }
    }
}